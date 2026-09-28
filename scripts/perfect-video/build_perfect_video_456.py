"""Build a guarded, versioned Academy release from original Bulgarian lesson briefs.

Run locally; the generated SQL is the migration committed to the repository.
The script never connects to Supabase or GitHub.
"""

import json
from pathlib import Path

from perfect_video_456_content import LESSONS


MODULES = {"s02-m04": 17, "s02-m05": 8, "s02-m06": 18}
OPEN_ANSWER_TYPES = {"practical_response", "reflection", "homework", "submission", "prompt_builder"}


def choices(correct, wrong_a, wrong_b, seed):
    items = [("a", wrong_a), ("b", correct), ("c", wrong_b)]
    order = [1, 0, 2] if seed % 3 == 0 else ([0, 2, 1] if seed % 3 == 1 else [2, 1, 0])
    shuffled = [{"id": chr(97 + i), "label": items[j][1]} for i, j in enumerate(order)]
    key = next(o["id"] for o in shuffled if o["label"] == correct)
    return shuffled, key


def block(position, key, kind, title, content, points=2, required=True, answer=None, explanation=None):
    item = {
        "position": position, "block_key": key, "block_type": kind,
        "title": title, "content": content, "points": points, "required": required,
    }
    if answer is not None:
        item["answer_key"] = answer
        item["feedback"] = {"explanation": explanation}
        item["scoring"] = {"mode": "exact_order" if kind == "sequence_sort" else "single_choice"}
    return item


def build_lesson(s, seed):
    title = s["title"]
    steps = s["steps"]
    ordered = "\n".join(f"{i}. {value}" for i, value in enumerate(steps, 1))
    opts_a, answer_a = choices(s["fix"], s["bad"], s["trap"], seed)
    opts_b, answer_b = choices(s["core"], s["bad"], s["trap"], seed + 1)
    opts_c, answer_c = choices(s["limit"], "Тази настройка работи еднакво добре при всички места и хора.", s["trap"], seed + 2)
    opts_d, answer_d = choices(s["transfer"], s["bad"], s["trap"], seed + 3)
    blocks = [
        block(0, "objective", "objective", "Какво ще можеш", {"body": s["goal"] + " Провери умението с работен случай, два теста и ред на действията."}, 1),
        block(1, "hook", "hook", "Кога се чупи работата", {"body": s["hook"]}, 1),
        block(2, "core", "rich_text", "Основното решение", {"body": s["core"] + "\n\n" + s["detail"]}),
        block(3, "deep_dive", "rich_text", "Какво се случва на терен", {"body": s["deep"] + "\n\nГраница на решението: " + s["limit"]}),
        block(4, "method", "rich_text", "Работен ред", {"body": "Започни от условията, после променяй само това, което можеш да провериш.\n\n" + ordered + "\n\nСтоп-сигнал: " + s["bad"] + "\nВърни се към пробата: " + s["check"]}),
        block(5, "worked_example", "example", "Разгледай решен случай", {"body": s["case"] + "\n\nРешение: " + s["fix"] + "\n\nДоказателство, че работи: " + s["check"]}),
        block(6, "before_after", "before_after", "Грешният ход и корекцията", {"before": {"label": "Как се губи контрол", "text": s["bad"]}, "after": {"label": "Как го поправяш", "text": s["fix"] + " " + s["check"]}}),
        block(7, "field_diagnostic", "rich_text", "Проверка в истински условия", {"body": s["field"] + "\n\nВземи доказателство, което би показал на друг монтажист: " + s["check"] + "\n\nАко резултатът не издържа, не замаскирай проблема с ефект. Върни се към причината: " + s["bad"] + "\n\nГраницата: " + s["limit"]}),
        block(8, "knowledge_check", "quiz", "Избери работещия принцип", {"question": "При „" + title + "“ кое решение запазва контрол върху резултата?", "options": opts_b}, answer={"correct": answer_b}, explanation=s["core"] + " " + s["detail"]),
        block(9, "decision_case", "scenario", "Реши ситуацията", {"prompt": s["case"] + "\n\nКой ход предприемаш първо и как ще го провериш?", "options": opts_a}, points=3, answer={"correct": answer_a}, explanation=s["fix"] + " " + s["check"]),
        block(10, "boundary_check", "quiz", "Къде свършва правилото", {"question": "Кое ограничение трябва да провериш, преди да повториш решението на друг терен?", "options": opts_c}, answer={"correct": answer_c}, explanation=s["limit"]),
        block(11, "summary", "summary", "Запомни за следващите снимки", {"takeaways": [s["core"], s["fix"], "Не пропускай контрола: " + s["check"]], "nextStep": s["field"]}),
        block(12, "sequence_practice", "sequence_sort", "Подреди зависимостите", {"instruction": "Подреди хода така, че пробата да предхожда окончателното решение. " + s["limit"], "items": [{"id": "s3", "text": steps[2]}, {"id": "s1", "text": steps[0]}, {"id": "s4", "text": steps[3]}, {"id": "s2", "text": steps[1]}]}, required=False, answer={"order": ["s1", "s2", "s3", "s4"]}, explanation="Правилният ред: " + " → ".join(steps)),
        block(13, "scenario_transfer", "scenario", "Когато условието се промени", {"prompt": "Нов случай: " + s["new_case"] + "\n\nКакво ще направиш сега?", "options": opts_d}, points=3, answer={"correct": answer_d}, explanation=s["transfer"] + " " + s["limit"]),
        block(14, "field_note", "rich_text", "Бележка от снимачния ден", {"body": s["note"] + "\n\nРаботна карта:\n" + ordered + "\n\nКритерий за предаване: " + s["check"]}, points=1, required=False),
    ]
    module = s["id"].split("-")[0].replace("pv", "s02-m")
    return {
        "module_id": module, "lesson_id": s["id"], "title": title, "subtitle": s["subtitle"],
        "objective": s["goal"], "hook": s["hook"], "estimated_minutes": s.get("minutes", 30),
        "blocks": blocks,
    }


VALIDATION_FUNCTION = r"""
CREATE OR REPLACE FUNCTION academy_private.lesson_validation(p_version uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO ''
AS $function$
DECLARE
 v public.academy_lesson_versions;
 errors jsonb := '[]'::jsonb;
 warnings jsonb := '[]'::jsonb;
 n integer;
 kinds text[];
BEGIN
 SELECT * INTO v FROM public.academy_lesson_versions WHERE id=p_version;
 IF NOT FOUND THEN RAISE EXCEPTION 'Version not found'; END IF;
 SELECT count(*),coalesce(array_agg(DISTINCT block_type),'{}') INTO n,kinds
 FROM public.academy_lesson_blocks WHERE version_id=p_version;
 IF btrim(v.objective)='' THEN errors:=errors||jsonb_build_array('missing_objective'); END IF;
 IF btrim(v.hook)='' THEN errors:=errors||jsonb_build_array('missing_hook'); END IF;
 IF n<5 THEN errors:=errors||jsonb_build_array('too_few_blocks'); END IF;
 IF NOT (kinds && ARRAY['sequence_sort','matching','image_hotspot','decision_tree','scenario','client_simulation','calculator','prompt_builder','practical_response','reflection','checklist','quiz','homework','submission','flip_cards']) THEN
  errors:=errors||jsonb_build_array('missing_interaction');
 END IF;
 IF NOT ('quiz'=ANY(kinds)) THEN errors:=errors||jsonb_build_array('missing_knowledge_check'); END IF;
 IF NOT (
  kinds && ARRAY['prompt_builder','practical_response','homework','submission']
  OR (
   EXISTS (
    SELECT 1 FROM public.academy_lessons l
    WHERE l.id=v.academy_lesson_id
      AND l.module_id IN ('s02-m01','s02-m02','s02-m03','s02-m04','s02-m05','s02-m06')
   )
   AND kinds && ARRAY['sequence_sort','matching','image_hotspot','decision_tree','scenario','client_simulation','calculator']
  )
 ) THEN errors:=errors||jsonb_build_array('missing_practice'); END IF;
 IF NOT ('summary'=ANY(kinds)) THEN errors:=errors||jsonb_build_array('missing_summary'); END IF;
 IF EXISTS (SELECT 1 FROM public.academy_lesson_blocks b WHERE b.version_id=p_version AND b.required AND b.points=0) THEN
  warnings:=warnings||jsonb_build_array('required_block_has_no_xp');
 END IF;
 IF EXISTS(
  SELECT 1 FROM public.academy_lesson_blocks b
  LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
  WHERE b.version_id=p_version
    AND b.block_type IN ('sequence_sort','matching','image_hotspot','decision_tree','scenario','client_simulation','calculator','quiz')
    AND k.block_id IS NULL
 ) THEN errors:=errors||jsonb_build_array('missing_server_evaluation'); END IF;
 RETURN jsonb_build_object(
  'errors',errors, 'warnings',warnings, 'block_count',n,
  'interactive',kinds && ARRAY['sequence_sort','matching','image_hotspot','decision_tree','scenario','client_simulation','calculator','prompt_builder','practical_response','reflection','checklist','quiz','homework','submission','flip_cards'],
  'has_quiz','quiz'=ANY(kinds),
  'has_assignment',kinds && ARRAY['practical_response','homework','submission']
 );
END $function$;
"""


RELEASE_SQL = r"""
-- Safe edition replacement for 43 already published lessons. User history and attempts are retained.
-- A failure in any guard aborts the entire migration and leaves the published pointers intact.
DO $release$
DECLARE
 payload jsonb := $curriculum$__PAYLOAD__$curriculum$::jsonb;
 item jsonb;
 part jsonb;
 lesson public.academy_lessons;
 new_version uuid;
 new_block uuid;
 validation_result jsonb;
 n integer := 0;
 rows_updated integer;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext('perfect_video_modules_4_6_v5'));
 -- Fresh installations can have no legacy Perfect Video content. The production
 -- release is guarded for the complete 43-lesson catalog; do not fabricate it here.
 IF (SELECT count(*) FROM public.academy_lessons
     WHERE module_id IN ('s02-m04','s02-m05','s02-m06'))=0 THEN
   RETURN;
 END IF;
 IF (SELECT count(*) FROM public.academy_lessons WHERE module_id IN ('s02-m04','s02-m05','s02-m06'))<>43
    OR (SELECT count(*) FROM public.academy_lessons WHERE module_id='s02-m04')<>17
    OR (SELECT count(*) FROM public.academy_lessons WHERE module_id='s02-m05')<>8
    OR (SELECT count(*) FROM public.academy_lessons WHERE module_id='s02-m06')<>18
    OR jsonb_array_length(payload)<>43 THEN
   RAISE EXCEPTION 'Perfect Video 4–6 lesson count changed; release aborted';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid='public.academy_lesson_progress'::regclass
      AND tgname='archive_academy_lesson_progress_version' AND NOT tgisinternal) THEN
   RAISE EXCEPTION 'Progress archive trigger is missing';
 END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(payload) LOOP
   n:=n+1;
   SELECT * INTO lesson FROM public.academy_lessons
   WHERE module_id=item->>'module_id' AND lesson_id=item->>'lesson_id' FOR UPDATE;
   IF lesson.id IS NULL OR lesson.status<>'published'
      OR lesson.published_version_id IS NULL
      OR lesson.published_version_id IS DISTINCT FROM lesson.draft_version_id
      OR (SELECT count(*) FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id)<>2 THEN
     RAISE EXCEPTION 'Unexpected lesson state: %/%',item->>'module_id',item->>'lesson_id';
   END IF;
   IF (SELECT count(*) FROM jsonb_array_elements(item->'blocks'))<>15 THEN
     RAISE EXCEPTION 'Wrong block count: %/%',item->>'module_id',item->>'lesson_id';
   END IF;
   INSERT INTO public.academy_lesson_versions
     (academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,objective,hook,
      estimated_minutes,source_kind,change_note)
   SELECT lesson.id, max(version_number)+1,lesson.published_version_id,
     item->>'title',item->>'subtitle',(item->>'estimated_minutes')||' мин',
     item->>'objective',item->>'hook',(item->>'estimated_minutes')::int,'editor',
     'Редакционна версия v5: практическа програма; 15 стъпки и оценявани решения'
   FROM public.academy_lesson_versions WHERE academy_lesson_id=lesson.id
   RETURNING id INTO new_version;
   FOR part IN SELECT value FROM jsonb_array_elements(item->'blocks') LOOP
     INSERT INTO public.academy_lesson_blocks
       (version_id,block_key,position,block_type,title,content,required,points)
     VALUES(new_version,part->>'block_key',(part->>'position')::int,part->>'block_type',
       part->>'title',part->'content',(part->>'required')::boolean,(part->>'points')::int)
     RETURNING id INTO new_block;
     IF part ? 'answer_key' THEN
       INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
       VALUES(new_block,part->'answer_key',part->'feedback',part->'scoring');
     END IF;
   END LOOP;
   IF (SELECT count(*) FROM academy_private.lesson_block_keys k
        JOIN public.academy_lesson_blocks b ON b.id=k.block_id WHERE b.version_id=new_version)<>5
      OR (SELECT count(*) FROM public.academy_lesson_blocks b WHERE b.version_id=new_version AND b.required)<>13
      OR (SELECT count(*) FROM public.academy_lesson_blocks b WHERE b.version_id=new_version AND b.block_type IN
           ('practical_response','reflection','homework','submission','prompt_builder'))<>0
      OR EXISTS (SELECT 1 FROM public.academy_lesson_blocks b
           JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
           WHERE b.version_id=new_version AND b.block_type IN ('quiz','scenario') AND
             NOT EXISTS (SELECT 1 FROM jsonb_array_elements(b.content->'options') o
                         WHERE o->>'id'=k.answer_key->>'correct')) THEN
     RAISE EXCEPTION 'Invalid block/key structure: %/%',item->>'module_id',item->>'lesson_id';
   END IF;
   validation_result:=academy_private.lesson_validation(new_version);
   IF jsonb_array_length(validation_result->'errors')<>0 OR jsonb_array_length(validation_result->'warnings')<>0 THEN
     RAISE EXCEPTION 'Validation failed for %/%: %',item->>'module_id',item->>'lesson_id',validation_result;
   END IF;
   UPDATE public.academy_lesson_versions SET validation=validation_result WHERE id=new_version;
   INSERT INTO academy_private.lesson_progress_history
     (user_id,academy_lesson_id,version_id,snapshot,archived_at,reason)
   SELECT p.user_id,p.academy_lesson_id,p.version_id,to_jsonb(p),clock_timestamp(),'pre_publish_v5'
   FROM public.academy_lesson_progress p WHERE p.academy_lesson_id=lesson.id
   ON CONFLICT (user_id,academy_lesson_id,version_id) DO UPDATE
   SET snapshot=EXCLUDED.snapshot,archived_at=EXCLUDED.archived_at,reason=EXCLUDED.reason;
   UPDATE public.academy_lessons SET draft_version_id=new_version,
      published_version_id=new_version,status='published',updated_at=now() WHERE id=lesson.id;
   GET DIAGNOSTICS rows_updated=ROW_COUNT;
   IF rows_updated<>1 THEN RAISE EXCEPTION 'Publish lost row for %',item->>'lesson_id'; END IF;
   INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,actor_id,action,details)
   VALUES(lesson.id,new_version,NULL,'published',jsonb_build_object(
     'source','perfect_video_modules_4_6_v5','previous_version_preserved',true,'progress_archived',true));
 END LOOP;
 IF n<>43 THEN RAISE EXCEPTION 'Published %, expected 43',n; END IF;
END $release$;
"""


def main():
    assert len(LESSONS) == 43
    assert set(x["id"] for x in LESSONS) == {
        f"pv{module:02d}-{i:02d}" for module, count in [(4, 17), (5, 8), (6, 18)] for i in range(1, count + 1)
    }
    assert len({x["title"] for x in LESSONS}) == 43, "Duplicate lesson title"
    built = [build_lesson(s, i) for i, s in enumerate(LESSONS)]
    for lesson in built:
        blocks = lesson["blocks"]
        assert len(blocks) == 15 and sum(b["required"] for b in blocks) == 13
        assert sum("answer_key" in b for b in blocks) == 5
        assert not set(b["block_type"] for b in blocks) & OPEN_ANSWER_TYPES
        for b in blocks:
            if b["block_type"] in ("quiz", "scenario"):
                assert b["answer_key"]["correct"] in [o["id"] for o in b["content"]["options"]]
                assert len(set(o["label"] for o in b["content"]["options"])) == 3
        assert min(len(b["content"].get("body", "")) for b in blocks if b["block_key"] in ("core", "deep_dive", "method", "field_diagnostic")) >= 240
    data = json.dumps(built, ensure_ascii=False, separators=(",", ":"))
    assert "$curriculum$" not in data
    out = VALIDATION_FUNCTION + RELEASE_SQL.replace("__PAYLOAD__", data)
    Path("perfect_video_modules_4_6_v5.sql").write_text(out, encoding="utf8")
    Path("perfect_video_modules_4_6_v5.json").write_text(json.dumps(built, ensure_ascii=False, indent=2), encoding="utf8")
    print(f"{len(built)} lessons; {len(built) * 15} blocks; {len(out.encode())} SQL bytes")


if __name__ == "__main__":
    main()
