"""Export the reviewed private staging snapshot without any grading data.

Input is an owner export of academy_private.video_client_workflow_candidates.
Never put that input in source control. Public teaching and the dependency map
remain reproducible even when the transient authoring workspace is replaced.
"""
import argparse,base64,copy,gzip,hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
TARGET=ROOT/'course-assets/perfect-video/client-workflow'
def export(rows):
    assert len(rows)==77
    order={}
    for mod in ['s02-m06','s02-m07','s02-m08','s02-m09','s02-m10']:
        selected={r['lessonId']:r for r in rows if r['moduleId']==mod}
        links={code:re.search(r'\((pv\d{2}-\d{2})\)',next(b for b in r['payload']['blocks'] if b['key']=='summary')['content']['nextStep']).group(1) for code,r in selected.items()}
        starts=set(selected)-set(links.values());assert len(starts)==1
        chain=[];code=starts.pop()
        while code in selected:
            assert code not in chain
            chain.append(code);code=links[code]
        assert len(chain)==len(selected)
        order[mod]=chain
    public=[]
    for row in rows:
        p=copy.deepcopy(row['payload'])
        for b in p['blocks']:
            for k in ['answer_key','feedback','scoring']:b.pop(k,None)
        public.append(dict(moduleId=row['moduleId'],lessonId=row['lessonId'],**p))
    assert sum(len(r['blocks']) for r in public)==1061
    data=json.dumps(public,ensure_ascii=False,separators=(',',':')).encode()
    packed=gzip.compress(data,mtime=0);encoded=base64.b64encode(packed).decode()
    TARGET.mkdir(parents=True,exist_ok=True);parts=[]
    for start in range(0,len(encoded),50000):
        name=f'lessons.{len(parts):03}.base64';parts.append(name)
        (TARGET/name).write_text(encoded[start:start+50000]+'\n')
    manifest=dict(release='video_client_workflow_v1',modules={k:len(v) for k,v in order.items()},lessons=77,blocks=1061,newCases=5,newDecisions=25,curriculum=dict(parts=parts,bytes=len(packed),sha256=hashlib.sha256(packed).hexdigest(),decodedBytes=len(data),decodedSha256=hashlib.sha256(data).hexdigest()))
    (TARGET/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    (TARGET/'order.json').write_text(json.dumps(order,indent=2)+'\n')
    print(json.dumps({k:v for k,v in manifest.items() if k!='curriculum'}))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--private-source',required=True);a=p.parse_args()
    source=Path(a.private_source).resolve()
    if source.is_relative_to(ROOT):raise ValueError('Private source must remain outside the repository')
    export(json.loads(source.read_text()))
