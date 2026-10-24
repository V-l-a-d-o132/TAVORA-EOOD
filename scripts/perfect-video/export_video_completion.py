"""Export the reviewed private staging snapshot without any grading data.

Input is an owner export of academy_private.video_client_completion_candidates.
Never put that input in source control. Public teaching and the dependency map
remain reproducible even when the transient authoring workspace is replaced.
"""
import argparse,base64,copy,gzip,hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
TARGET=ROOT/'course-assets/perfect-video/client-completion'
ORDER_TARGET=ROOT/'src/data/video-completion-order.ts'
def export(rows):
    assert len(rows)==73
    from build_video_completion import ORDER
    order={f's02-m{m:02}':[f'pv{m:02}-{n:02}' for n in ids] for m,ids in ORDER.items()}
    public=[]
    for row in rows:
        p=copy.deepcopy(row['payload'])
        for b in p['blocks']:
            for k in ['answer_key','feedback','scoring']:b.pop(k,None)
        public.append(dict(moduleId=row['moduleId'],lessonId=row['lessonId'],**p))
    assert sum(len(r['blocks']) for r in public)==965
    data=json.dumps(public,ensure_ascii=False,separators=(',',':')).encode()
    packed=gzip.compress(data,mtime=0);encoded=base64.b64encode(packed).decode()
    TARGET.mkdir(parents=True,exist_ok=True);parts=[]
    for start in range(0,len(encoded),50000):
        name=f'lessons.{len(parts):03}.base64';parts.append(name)
        (TARGET/name).write_text(encoded[start:start+50000]+'\n')
    manifest=dict(release='video_client_completion_v1',modules={k:len(v) for k,v in order.items()},lessons=73,blocks=965,newCases=5,newDecisions=25,curriculum=dict(parts=parts,bytes=len(packed),sha256=hashlib.sha256(packed).hexdigest(),decodedBytes=len(data),decodedSha256=hashlib.sha256(data).hexdigest()))
    (TARGET/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    ORDER_TARGET.parent.mkdir(parents=True,exist_ok=True)
    ORDER_TARGET.write_text('// Shared by the course catalogue and the reviewed curriculum exporter.\nexport const VIDEO_COMPLETION_LESSON_ORDER: Record<string, string[]> = '+json.dumps(order,indent=2)+';\n')
    print(json.dumps({k:v for k,v in manifest.items() if k!='curriculum'}))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--private-source',required=True);a=p.parse_args()
    source=Path(a.private_source).resolve()
    if source.is_relative_to(ROOT):raise ValueError('Private source must remain outside the repository')
    export(json.loads(source.read_text()))
