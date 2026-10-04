"""Transport the committed SQL in bounded parts without splitting publication.

Private curriculum fragments use the existing admin-only editorial audit table.
The final DO block is the committed migration, with only its payload initializer
replaced by reassembly and an additional exact-text hash check. It still updates
all 75 lessons in one transaction. Staging is removed only after verification.
"""

import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MIGRATION = ROOT / "supabase/migrations/20261004083926_perfect_video_modules_7_11_clear_practice.sql"
RELEASE = "perfect_video_modules_7_11_clear_practice_20261004"
MARKER = "$pv711_payload$"
PART_MARKER = "$pv711_delivery_part$"
PART_CHARS = 150000


def md5(text):
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def build():
    original = MIGRATION.read_text()
    prefix, payload, suffix = original.split(MARKER)
    assert json.loads(payload) == json.loads((ROOT / "scripts/perfect-video/releases/modules-7-11-clear-practice-20261004.json").read_text())
    assert PART_MARKER not in payload
    fragments = [payload[i:i + PART_CHARS] for i in range(0, len(payload), PART_CHARS)]
    stages = []
    for i, fragment in enumerate(fragments, 1):
        stages.append(f"""-- Delivery only: no published lesson or learner row is changed.
INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
SELECT l.id,l.published_version_id,'saved',jsonb_build_object(
 'delivery_for','{RELEASE}','delivery_part',{i},'delivery_parts',{len(fragments)},
 'payload_md5','{md5(payload)}','payload_text',{PART_MARKER}{fragment}{PART_MARKER})
FROM public.academy_lessons l WHERE l.module_id='s02-m07' AND l.lesson_id='pv07-01'
AND l.status='published' AND NOT EXISTS(
 SELECT 1 FROM public.academy_lesson_audit a WHERE a.academy_lesson_id=l.id
 AND a.version_id=l.published_version_id AND a.details->>'delivery_for'='{RELEASE}'
 AND (a.details->>'delivery_part')::integer={i})
RETURNING details->>'delivery_part' part,length(details->>'payload_text') chars,md5(details->>'payload_text') part_md5;
""")
    initializer = f"""payload_text text := (SELECT string_agg(a.details->>'payload_text',''
 ORDER BY (a.details->>'delivery_part')::integer)
 FROM public.academy_lesson_audit a JOIN public.academy_lessons l ON l.id=a.academy_lesson_id
 WHERE a.version_id=l.published_version_id AND l.module_id='s02-m07' AND l.lesson_id='pv07-01'
 AND a.details->>'delivery_for'='{RELEASE}');
 specs jsonb := payload_text"""
    assert prefix.endswith("specs jsonb := ")
    apply_sql = prefix[:-len("specs jsonb := ")] + initializer + suffix
    guard = f"""
 IF md5(payload_text) IS DISTINCT FROM '{md5(payload)}' THEN
  RAISE EXCEPTION 'Video delivery payload hash mismatch; no lesson was published';
 END IF;
 IF jsonb_array_length(specs)<>75 THEN RAISE EXCEPTION 'Video delivery requires 75 lessons'; END IF;
"""
    assert apply_sql.count("\n learner_before:=") == 1
    apply_sql = apply_sql.replace("\n learner_before:=", guard + "\n learner_before:=", 1)
    cleanup = f"""DELETE FROM public.academy_lesson_audit
WHERE details->>'delivery_for'='{RELEASE}'
AND EXISTS(SELECT 1 FROM public.academy_lesson_audit a
 WHERE a.details->>'release'='{RELEASE}'
 AND a.details->'publication_receipt'->>'learner_records_unchanged'='true')
RETURNING details->>'delivery_part' removed_part;
"""
    return {"stages": stages, "apply": apply_sql, "cleanup": cleanup,
            "parts": len(fragments), "payload_md5": md5(payload),
            "canonical_sql_md5": md5(original), "applied_sql_md5": md5(apply_sql),
            "part_metadata": [{"part": i, "chars": len(f), "md5": md5(f)} for i, f in enumerate(fragments, 1)]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    output = parser.add_mutually_exclusive_group(required=True)
    output.add_argument("--json", action="store_true")
    output.add_argument("--output", type=Path)
    args = parser.parse_args()
    delivery = build()
    if args.json:
        print(json.dumps(delivery, ensure_ascii=False))
        return
    args.output.mkdir(parents=True, exist_ok=True)
    files = []
    for i, sql in enumerate(delivery["stages"], 1):
        path = args.output / f"stage-{i:02d}.sql"
        path.write_text(sql)
        files.append({"path": str(path), "chars": len(sql), "md5": md5(sql)})
    for key in ["apply", "cleanup"]:
        path = args.output / f"{key}.sql"
        path.write_text(delivery[key])
        files.append({"path": str(path), "chars": len(delivery[key]), "md5": md5(delivery[key])})
    metadata = {key: value for key, value in delivery.items() if key not in ["stages", "apply", "cleanup"]}
    metadata["files"] = files
    (args.output / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(json.dumps({"parts": delivery["parts"], "apply_chars": len(delivery["apply"]), "canonical_sql_md5": delivery["canonical_sql_md5"]}))


if __name__ == "__main__":
    main()
