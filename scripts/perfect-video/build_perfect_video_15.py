"""Build and check the guarded release of Perfect Video's practical final module."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

from perfect_video_15_content import CHECKPOINTS, FINAL, PRACTICE


ROOT = Path(__file__).resolve().parents[2]
MIGRATION = ROOT / "supabase/migrations/20260929215642_perfect_video_module_15_practical_exam.sql"
VALIDATION_SOURCE = ROOT / "supabase/migrations/20260929212115_perfect_video_modules_13_14_v8_release.sql"
BLOCK_SOURCE = ROOT / "supabase/migrations/20260928120433_perfect_video_progress_history_and_graded_scenarios.sql"


def options(correct: str, wrong_one: str, wrong_two: str, seed: int):
    answers = [correct, wrong_one, wrong_two]
    shift = seed % 3
    answers = answers[shift:] + answers[:shift]
    items = [{"id": chr(97 + i), "label": label} for i, label in enumerate(answers)]
    key = next(item["id"] for item in items if item["label"] == correct)
    return items, key


def block(blocks: list[dict], name: str, kind: str, title: str, content: dict,
          *, points: int = 1, required: bool = True, answer: dict | None = None,
          explanation: str | None = None, scoring: dict | None = None):
    row = dict(position=len(blocks), block_key=name, block_type=kind,
               title=title, content=content, points=points, required=required)
    if answer is not None:
        row.update(answer_key=answer,
                   feedback={"explanation": explanation or ""},
                   scoring=scoring or {"mode": "single_choice"})
    blocks.append(row)


def practical(spec: dict, index: int):
    b: list[dict] = []
    block(b, "objective", "objective", "Какво ще завършиш", {"body": spec["acceptance"]})
    block(b, "hook", "hook", "Работната ситуация", {"body": spec["hook"]})
    block(b, "principle", "rich_text", "Решението зад действието", {"body": spec["principle"]}, points=2)
    block(b, "steps", "rich_text", "Работен ред", {"body": "\n".join(f"{n}. {step}" for n, step in enumerate(spec["steps"], 1))}, points=2)
    block(b, "case", "example", "Как би работил професионалист", {"body": spec["case"]}, points=2)
    block(b, "repair", "before_after", "Слабият ход и поправката", {
        "before": {"label": "Грешка", "text": spec["failure"]},
        "after": {"label": "Поправка", "text": spec["repair"]}}, points=2)
    block(b, "diagnosis", "rich_text", "Ако условията се променят", {
        "body": "Първо виж кой факт се е променил. Запази стария файл и брифа, за да не приписваш новото решение на стари условия. "
                + spec["repair"] + "\n\nСтатусът остава проба, докато не покриеш критерия: " + spec["acceptance"]}, points=2)
    block(b, "practice", "rich_text", "Твоята работа", {"body": spec["practice"]}, points=2)
    block(b, "acceptance", "rich_text", "Сам провери резултата", {"body": spec["acceptance"] + "\n\nЗапиши кое е реално проверено и кое е само допускане. Пази изходната и променената версия. Не включвай човек, актив или клиентски материал без право за тази употреба."})
    if spec["extra"]:
        block(b, "field_note", "rich_text", "Граничен случай", {"body": spec["extra"]}, points=1, required=False)
    if spec["id"] == "pv15-07":
        block(b, "optional_portfolio", "submission", "Линк към позволеното портфолио (по избор)", {
            "prompt": "Ако имаш право да покажеш проекта, можеш да добавиш линк към позволената версия или PDF с процеса. Този линк не се оценява автоматично и не влияе на изпита."}, points=0, required=False)
    block(b, "reference", "rich_text", "Проверен професионален източник", {
        "body": spec["source"] + "\nИзползвай принципа и провери актуалните условия на конкретната платформа или проекта."}, points=0, required=False)
    assessments = [
        ("quiz", "decision", spec["decisions"]),
        ("scenario", "edge", spec["edge"]),
        ("quiz", "measure", spec["measure"]),
        ("scenario", "repair_choice", (
            "Виждаш този проблем: " + spec["failure"] + " Коя е следващата работна стъпка?",
            spec["repair"], "Приемаш файла за готов без проверка.",
            "Заменяш липсващото доказателство с общо обещание.")),
    ]
    for offset, (kind, name, (question, correct, wrong1, wrong2)) in enumerate(assessments):
        choices, key = options(correct, wrong1, wrong2, index * 4 + offset)
        block(b, name, kind, "Решение в реална ситуация", {
            "question" if kind == "quiz" else "prompt": question,
            "options": choices}, points=4, answer={"correct": key},
            explanation="Тук решението е: " + correct + "\nКритерият за проверка: " + spec["acceptance"])
    steps = spec["steps"]
    items = [{"id": f"s{i}", "text": step} for i, step in enumerate(steps, 1)]
    if index % 2:
        items.reverse()
    else:
        items = items[2:] + items[:2]
    block(b, "sequence", "sequence_sort", "Подреди действията", {
        "instruction": "Сложи проверката преди финалното предаване.", "items": items},
        points=4, answer={"order": [f"s{i}" for i in range(1, len(steps) + 1)]},
        explanation="Редът пази най-рисковите зависимости: " + " → ".join(steps),
        scoring={"mode": "exact_order"})
    block(b, "summary", "summary", "Какво остава в проекта", {
        "takeaways": [spec["principle"], spec["repair"], spec["acceptance"]],
        "nextStep": spec["practice"]})
    return dict(module_id="s02-m15", lesson_id=spec["id"], title=spec["title"],
                subtitle="Финален проект по FRAME: реално решение, проверка и поправка",
                objective=spec["acceptance"], hook=spec["hook"],
                estimated_minutes=spec["minutes"], blocks=b)


def exam(spec: dict, index: int, final: bool = False):
    b: list[dict] = []
    topics = "целия курс" if final else ", ".join(m[-2:] for m in spec["modules"])
    block(b, "objective", "objective", "Какво доказваш", {
        "body": "Прилагаш работни решения от " + topics + ". Минимум 80% верни решения в общ опит. При непреминат изпит виждаш темите за повторение, без готов ключ."})
    block(b, "hook", "hook", "Казусът", {"body": spec["context"]})
    block(b, "read_case", "case_study", "Прочети условията, преди да отговаряш", {
        "body": spec["context"] + "\n\nНе добавяй права, резултати или ресурси, които брифът не дава."})
    block(b, "prepare", "rich_text", "Провери своя проект преди изпита", {"body": spec["practice"]}, points=2)
    block(b, "rules", "rich_text", "Как се оценява", {
        "body": "Отговори на всички въпроси и предай целия изпит наведнъж. Сървърът оценява общия опит; успехът е от 80% нагоре. Ако не достигнеш прага, ще видиш кои модули да повториш. Грешните въпроси не показват верния избор. След повторение можеш да предадеш нов пълен опит. Това е изпит на решения; качеството и авторството на твоя видеопроект не се оценяват само от теста."})
    block(b, "summary", "summary", "Какво да направиш след резултата", {
        "takeaways": ["Отделяй факт от допускане.", "Поправяй с доказателство и timecode, когато можеш.", "Резултат под 80% води до повторение на посочените теми."],
        "nextStep": "Прегледай работата си и премини към изпита като един цял опит."})
    questions = []
    answers = {}
    for j, q in enumerate(spec["questions"], 1):
        question_id = f"q{j:02d}"
        choices, key = options(q["correct"], q["wrong_one"], q["wrong_two"], j + index)
        questions.append({"id": question_id, "moduleId": q["module"],
                          "prompt": q["prompt"], "options": choices})
        answers[question_id] = key
    block(b, "exam", "course_exam", "Предай целия изпит", {
        "introduction": "Избери най-защитимото действие при дадените условия.",
        "questions": questions, "minimumPercent": 80},
        points=60 if final else 36, answer={"answers": answers},
        explanation="Виж темите за повторение по-долу. Провери логиката спрямо собствения си проект.",
        scoring={"mode": "aggregate", "minimumPercent": 80})
    return dict(module_id="s02-m15", lesson_id=spec["id"], title=spec["title"],
                subtitle="Общ практически изпит по решения, а не тест по определения",
                objective="Решаваш обвързани задачи от " + topics + " с поне 80% в един опит.",
                hook=spec["context"], estimated_minutes=spec["minutes"], blocks=b)


def curriculum():
    return [practical(spec, i) for i, spec in enumerate(PRACTICE)] + [
        exam(spec, 20 + i) for i, spec in enumerate(CHECKPOINTS)
    ] + [exam(FINAL, 30, final=True)]


def validate(lessons: list[dict]):
    assert len(lessons) == 13
    assert [x["lesson_id"] for x in lessons] == [f"pv15-{i:02d}" for i in range(1, 14)]
    catalog = (ROOT / "src/mocks/learning-platform.ts").read_text(encoding="utf-8")
    catalog = catalog[catalog.index("id: 's02-m15'"):catalog.index("id: 'marketing-basics'")]
    listing = re.findall(
        r"\{ id: '(pv15-\d{2})', title: '([^']+)', duration: '(\d+) мин', hasQuiz: true \}",
        catalog,
    )
    assert listing == [(x["lesson_id"], x["title"], str(x["estimated_minutes"]))
                       for x in lessons]
    positions = Counter()
    exam_count = 0
    for lesson in lessons:
        blocks = lesson["blocks"]
        assert [b["position"] for b in blocks] == list(range(len(blocks)))
        assert len({b["block_key"] for b in blocks}) == len(blocks)
        assert all(b["points"] or not b["required"] for b in blocks)
        for b in blocks:
            if b["block_type"] in {"quiz", "scenario"}:
                labels = [o["label"] for o in b["content"]["options"]]
                assert len(labels) == len(set(labels)) == 3
                positions[b["answer_key"]["correct"]] += 1
            if b["block_type"] == "course_exam":
                exam_count += 1
                qs = b["content"]["questions"]
                keys = b["answer_key"]["answers"]
                assert len(qs) in {12, 30}
                assert set(keys) == {q["id"] for q in qs}
                assert len({q["id"] for q in qs}) == len(qs)
                for q in qs:
                    assert len({o["label"] for o in q["options"]}) == 3
                    assert keys[q["id"]] in {o["id"] for o in q["options"]}
                    assert q["moduleId"] in {f"s02-m{i:02d}" for i in range(1, 16)}
                    positions[keys[q["id"]]] += 1
    assert exam_count == 5
    assert len(FINAL["questions"]) == 30
    assert Counter(q["module"] for q in FINAL["questions"]) == {
        f"s02-m{i:02d}": 2 for i in range(1, 16)
    }
    assert max(positions.values()) - min(positions.values()) <= 5, positions
    return positions


def extended_validator():
    prior = VALIDATION_SOURCE.read_text(encoding="utf-8")
    sql = prior[prior.index("CREATE OR REPLACE FUNCTION"):prior.index("DO $release$")]
    old = "'s02-m13','s02-m14'\n          )"
    assert sql.count(old) == 1
    sql = sql.replace(old, "'s02-m13','s02-m14','s02-m15'\n          )")
    assert sql.count("IF NOT ('quiz'=ANY(kinds))") == 1
    sql = sql.replace("IF NOT ('quiz'=ANY(kinds))",
                      "IF NOT (kinds && ARRAY['quiz','course_exam'])")
    sql = sql.replace("'checklist','quiz','homework'", "'checklist','quiz','course_exam','homework'")
    sql = sql.replace("'client_simulation','calculator','quiz'",
                      "'client_simulation','calculator','quiz','course_exam'")
    practice = "'scenario','client_simulation','calculator'\n      ]"
    assert sql.count(practice) == 1
    sql = sql.replace(practice,
                      "'scenario','client_simulation','calculator','course_exam'\n      ]")
    sql = sql.replace("'has_quiz','quiz'=ANY(kinds)",
                      "'has_quiz',kinds && ARRAY['quiz','course_exam']")
    assert sql.count("'course_exam'") >= 4
    return sql


def guarded_block_function():
    source = BLOCK_SOURCE.read_text(encoding="utf-8")
    start = source.index("CREATE OR REPLACE FUNCTION academy_private.complete_lesson_block(")
    end = source.index("END $function$;", start) + len("END $function$;")
    sql = source[start:end]
    needle = "IF b.id IS NULL THEN RAISE EXCEPTION 'Block not found'; END IF;"
    assert sql.count(needle) == 1
    return sql.replace(needle, needle + "\n IF b.block_type='course_exam' THEN RAISE EXCEPTION 'Use the course exam endpoint'; END IF;")


def migration_sql(lessons: list[dict]):
    payload = json.dumps(lessons, ensure_ascii=False, separators=(",", ":"))
    expected = ",".join("'" + lesson["lesson_id"] + "'" for lesson in lessons)
    return f"""-- Practical FRAME project, four cumulative checks, and an aggregate final exam.
-- Guard the exam endpoint before publishing blocks so the generic acknowledgement cannot bypass it.
SET lock_timeout = '5s';

ALTER TABLE public.academy_lesson_blocks
  DROP CONSTRAINT academy_lesson_blocks_block_type_check;
ALTER TABLE public.academy_lesson_blocks
  ADD CONSTRAINT academy_lesson_blocks_block_type_check CHECK (block_type IN (
    'objective','hook','concept','rich_text','step_reveal','before_after','flip_cards',
    'sequence_sort','matching','image_hotspot','decision_tree','case_study','scenario',
    'client_simulation','calculator','prompt_builder','practical_response','reflection',
    'checklist','quiz','course_exam','homework','submission','example','summary'
  ));

{guarded_block_function()}

{extended_validator()}

CREATE FUNCTION academy_private.submit_course_exam(
  p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $exam$
DECLARE
  uid uuid := (SELECT auth.uid());
  lesson_row public.academy_lessons;
  exam_block public.academy_lesson_blocks;
  previous public.academy_lesson_attempts_v2;
  question jsonb;
  answers jsonb;
  expected jsonb;
  provided text;
  total integer;
  passed_count integer := 0;
  exam_percent integer;
  score_value integer;
  weak_modules text[] := ARRAY[]::text[];
  prior_count integer;
  result jsonb;
  progress jsonb;
BEGIN
  IF uid IS NULL OR p_module <> 's02-m15' OR NOT academy_private.can_access(p_module) THEN
    RAISE EXCEPTION 'Access denied' USING ERRCODE='42501';
  END IF;
  IF jsonb_typeof(p_payload) IS DISTINCT FROM 'object' OR
     pg_column_size(p_payload)>65536 OR jsonb_typeof(p_payload->'answers') IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid exam payload';
  END IF;
  SELECT * INTO lesson_row FROM public.academy_lessons
  WHERE module_id=p_module AND lesson_id=p_lesson AND status='published'
    AND published_version_id=p_version;
  IF NOT FOUND OR p_lesson NOT IN ('pv15-09','pv15-10','pv15-11','pv15-12','pv15-13') THEN
    RAISE EXCEPTION 'Published exam not found';
  END IF;
  SELECT * INTO exam_block FROM public.academy_lesson_blocks
  WHERE version_id=p_version AND block_key=p_block_key AND block_type='course_exam';
  IF NOT FOUND THEN RAISE EXCEPTION 'Exam block not found'; END IF;
  SELECT k.answer_key->'answers' INTO expected
  FROM academy_private.lesson_block_keys k WHERE k.block_id=exam_block.id;
  IF jsonb_typeof(expected) IS DISTINCT FROM 'object' OR
     jsonb_typeof(exam_block.content->'questions') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Exam has no answer key';
  END IF;

  -- Serialize concurrent attempts for the same learner and block.
  PERFORM pg_advisory_xact_lock(hashtextextended(uid::text || ':' || exam_block.id::text,0));
  SELECT * INTO previous FROM public.academy_lesson_attempts_v2 WHERE id=p_attempt;
  IF FOUND THEN
    IF previous.user_id<>uid OR previous.block_id<>exam_block.id OR previous.payload<>p_payload THEN
      RAISE EXCEPTION 'Attempt conflict';
    END IF;
    RETURN jsonb_build_object('attemptId',previous.id,'correct',previous.is_correct,
      'score',previous.score,'maxScore',previous.max_score,'feedback',previous.feedback,
      'progress',(SELECT to_jsonb(p) FROM public.academy_lesson_progress p
        WHERE p.user_id=uid AND p.academy_lesson_id=lesson_row.id));
  END IF;
  IF EXISTS (SELECT 1 FROM public.academy_lesson_progress p
    WHERE p.user_id=uid AND p.academy_lesson_id=lesson_row.id AND p.version_id=p_version
      AND p_block_key=ANY(p.completed_block_keys)) THEN
    RAISE EXCEPTION 'Exam already passed';
  END IF;
  IF p_lesson='pv15-13' THEN
    SELECT count(*) INTO prior_count FROM public.academy_lessons l
    JOIN public.academy_lesson_progress p ON p.academy_lesson_id=l.id
      AND p.user_id=uid AND p.version_id=l.published_version_id AND p.completed_at IS NOT NULL
    WHERE l.module_id='s02-m15' AND l.lesson_id BETWEEN 'pv15-01' AND 'pv15-12';
    IF prior_count<>12 THEN
      RAISE EXCEPTION 'Complete the 12 previous module 15 lessons before the final exam';
    END IF;
  END IF;

  answers:=p_payload->'answers';
  total:=jsonb_array_length(exam_block.content->'questions');
  IF total NOT BETWEEN 8 AND 35 OR
     (SELECT count(*) FROM jsonb_object_keys(answers))<>total OR
     (SELECT count(*) FROM jsonb_object_keys(expected))<>total THEN
    RAISE EXCEPTION 'Answer every exam question exactly once';
  END IF;
  FOR question IN SELECT value FROM jsonb_array_elements(exam_block.content->'questions') LOOP
    provided:=answers->>(question->>'id');
    IF provided IS NULL OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(question->'options') o
      WHERE o->>'id'=provided
    ) THEN
      RAISE EXCEPTION 'Invalid or missing exam choice';
    END IF;
    IF provided=expected->>(question->>'id') THEN
      passed_count:=passed_count+1;
    ELSIF NOT (question->>'moduleId')=ANY(weak_modules) THEN
      weak_modules:=array_append(weak_modules,question->>'moduleId');
    END IF;
  END LOOP;
  exam_percent:=round(100.0*passed_count/total)::integer;
  score_value:=round(exam_block.points::numeric*passed_count/total)::integer;
  result:=jsonb_build_object('complete',exam_percent>=80,
    'scorePercent',exam_percent,'correctCount',passed_count,'totalQuestions',total,
    'weakModules',to_jsonb(weak_modules),
    'explanation',CASE WHEN exam_percent>=80 THEN
      'Изпитът е преминат. Виж темите с грешки и провери тези решения в собствения си проект.'
      ELSE 'Повтори темите с грешки, после предай нов пълен опит. Верните отговори не се показват.' END);
  INSERT INTO public.academy_lesson_attempts_v2(
    id,user_id,academy_lesson_id,version_id,block_id,payload,score,max_score,is_correct,feedback)
  VALUES(p_attempt,uid,lesson_row.id,p_version,exam_block.id,p_payload,
    score_value,exam_block.points,exam_percent>=80,result);
  INSERT INTO public.academy_lesson_progress(
    user_id,academy_lesson_id,version_id,current_block_key,block_state,completed_block_keys)
  VALUES(uid,lesson_row.id,p_version,p_block_key,jsonb_build_object(p_block_key,p_payload),
    CASE WHEN exam_percent>=80 THEN ARRAY[p_block_key] ELSE ARRAY[]::text[] END)
  ON CONFLICT(user_id,academy_lesson_id) DO UPDATE SET
    version_id=EXCLUDED.version_id,current_block_key=EXCLUDED.current_block_key,
    block_state=CASE WHEN academy_lesson_progress.version_id=EXCLUDED.version_id
      THEN academy_lesson_progress.block_state||EXCLUDED.block_state ELSE EXCLUDED.block_state END,
    completed_block_keys=CASE WHEN academy_lesson_progress.version_id<>EXCLUDED.version_id
      THEN EXCLUDED.completed_block_keys
      WHEN exam_percent>=80 AND NOT p_block_key=ANY(academy_lesson_progress.completed_block_keys)
      THEN array_append(academy_lesson_progress.completed_block_keys,p_block_key)
      ELSE academy_lesson_progress.completed_block_keys END,
    last_activity_at=now();
  progress:=academy_private.refresh_lesson_progress(uid,lesson_row.id);
  RETURN jsonb_build_object('attemptId',p_attempt,'correct',exam_percent>=80,
    'score',score_value,'maxScore',exam_block.points,'feedback',result,'progress',progress);
END $exam$;

CREATE FUNCTION public.academy_submit_course_exam(
  p_module text,p_lesson text,p_version uuid,p_block_key text,p_payload jsonb,p_attempt uuid)
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path='' AS $wrapper$
  SELECT academy_private.submit_course_exam(p_module,p_lesson,p_version,p_block_key,p_payload,p_attempt)
$wrapper$;
REVOKE ALL ON FUNCTION academy_private.submit_course_exam(text,text,uuid,text,jsonb,uuid) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.academy_submit_course_exam(text,text,uuid,text,jsonb,uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION academy_private.submit_course_exam(text,text,uuid,text,jsonb,uuid),
  public.academy_submit_course_exam(text,text,uuid,text,jsonb,uuid) TO authenticated;

DO $release$
DECLARE
  payload jsonb := $curriculum${payload}$curriculum$::jsonb;
  lesson record;
  item jsonb;
  lesson_uuid uuid;
  version_uuid uuid;
  block_uuid uuid;
  report jsonb;
  total integer;
  keys integer;
BEGIN
  IF jsonb_typeof(payload)<>'array' OR jsonb_array_length(payload)<>13 OR
     (SELECT array_agg(p.lesson_id ORDER BY p.lesson_id)
      FROM jsonb_to_recordset(payload) p(lesson_id text))<>ARRAY[{expected}]::text[] OR
     (SELECT count(DISTINCT p.lesson_id) FROM jsonb_to_recordset(payload) p(lesson_id text))<>13 THEN
    RAISE EXCEPTION 'Unexpected module 15 lesson IDs';
  END IF;
  IF EXISTS (SELECT 1 FROM public.academy_lessons WHERE module_id='s02-m15') OR
     EXISTS (SELECT 1 FROM public.interactive_lessons WHERE module_id='s02-m15') THEN
    RAISE EXCEPTION 'Module 15 already exists; review before publishing';
  END IF;
  IF EXISTS (
    SELECT 1 FROM jsonb_to_recordset(payload) p(
      module_id text,lesson_id text,title text,objective text,hook text,
      estimated_minutes integer,blocks jsonb)
    WHERE p.module_id<>'s02-m15' OR btrim(p.title)='' OR btrim(p.objective)=''
       OR btrim(p.hook)='' OR p.estimated_minutes NOT BETWEEN 25 AND 60
       OR jsonb_typeof(p.blocks)<>'array'
       OR jsonb_array_length(p.blocks) NOT BETWEEN 7 AND 20
       OR (SELECT count(*) FROM jsonb_array_elements(p.blocks) b
           WHERE b->>'block_type'='course_exam')<>(CASE WHEN p.lesson_id>='pv15-09' THEN 1 ELSE 0 END)
       OR EXISTS (SELECT 1 FROM jsonb_array_elements(p.blocks) b
           WHERE b->>'block_type' IN ('homework','reflection','practical_response'))
  ) THEN RAISE EXCEPTION 'Module 15 content guard failed'; END IF;

  FOR lesson IN SELECT * FROM jsonb_to_recordset(payload) p(
    module_id text,lesson_id text,title text,subtitle text,objective text,
    hook text,estimated_minutes integer,blocks jsonb) ORDER BY lesson_id LOOP
    INSERT INTO public.academy_lessons(module_id,lesson_id,status)
    VALUES(lesson.module_id,lesson.lesson_id,'draft') RETURNING id INTO lesson_uuid;
    INSERT INTO public.academy_lesson_versions(
      academy_lesson_id,version_number,title,subtitle,duration,objective,hook,
      estimated_minutes,source_kind,change_note)
    VALUES(lesson_uuid,1,lesson.title,lesson.subtitle,
      lesson.estimated_minutes::text||' минути',lesson.objective,lesson.hook,
      lesson.estimated_minutes,'editor','FRAME финален проект и практични изпити v9')
    RETURNING id INTO version_uuid;
    FOR item IN SELECT value FROM jsonb_array_elements(lesson.blocks) LOOP
      INSERT INTO public.academy_lesson_blocks(
        version_id,block_key,"position",block_type,title,content,required,points)
      VALUES(version_uuid,item->>'block_key',(item->>'position')::integer,
        item->>'block_type',item->>'title',item->'content',
        (item->>'required')::boolean,(item->>'points')::integer)
      RETURNING id INTO block_uuid;
      IF item ? 'answer_key' THEN
        INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
        VALUES(block_uuid,item->'answer_key',item->'feedback',item->'scoring');
      END IF;
    END LOOP;
    report:=academy_private.lesson_validation(version_uuid);
    IF jsonb_array_length(report->'errors')<>0 OR jsonb_array_length(report->'warnings')<>0 THEN
      RAISE EXCEPTION 'Lesson % failed validation: %',lesson.lesson_id,report;
    END IF;
    UPDATE public.academy_lesson_versions SET validation=report WHERE id=version_uuid;
    UPDATE public.academy_lessons SET status='published',published_version_id=version_uuid,
      draft_version_id=version_uuid,updated_at=clock_timestamp() WHERE id=lesson_uuid;
    INSERT INTO public.academy_lesson_audit(
      academy_lesson_id,version_id,actor_id,action,details)
    VALUES(lesson_uuid,version_uuid,NULL,'published',
      jsonb_build_object('source','perfect_video_v9','preserved_existing_progress',true));
  END LOOP;
  SELECT count(*) INTO total FROM public.academy_lessons
    WHERE module_id='s02-m15' AND status='published' AND published_version_id IS NOT NULL;
  SELECT count(*) INTO keys FROM academy_private.lesson_block_keys k
    JOIN public.academy_lesson_blocks b ON b.id=k.block_id
    JOIN public.academy_lesson_versions v ON v.id=b.version_id
    JOIN public.academy_lessons l ON l.id=v.academy_lesson_id
    WHERE l.module_id='s02-m15' AND l.published_version_id=v.id;
  IF total<>13 OR keys<>45 THEN RAISE EXCEPTION 'Release incomplete: % lessons, % keys',total,keys; END IF;
END $release$;
"""


def main():
    lessons = curriculum()
    positions = validate(lessons)
    MIGRATION.write_text(migration_sql(lessons), encoding="utf-8")
    print(json.dumps({"lessons": len(lessons),
        "blocks": sum(len(x["blocks"]) for x in lessons),
        "questions": sum(len(x["content"]["questions"]) for lesson in lessons
                         for x in lesson["blocks"] if x["block_type"]=="course_exam"),
        "key_blocks": sum("answer_key" in b for x in lessons for b in x["blocks"]),
        "answer_positions": dict(positions),
        "migration_bytes": MIGRATION.stat().st_size}, ensure_ascii=False))


if __name__ == "__main__":
    main()
