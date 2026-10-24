"""Owner-side composition; private grading inputs and output stay outside git."""
import argparse,copy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
ORDER={11:[1,3,7,6,15,2,4,13,12,8,9,10,5,14,11,16],12:[1,2,7,3,4,5,6,8],13:[10,2,17,4,5,6,7,8,1,9,3,12,13,14,11,15,16,18],14:[4,1,3,6,8,10,2,5,7,9,12,11,16,17,13,14,15,18],15:list(range(1,14))}
INTRO={11:'След предаването ще отделяш качеството на файла от поведението на зрителите и резултата за бизнеса. Краткият V-1 и предложените дълги видеа имат различни задачи. Учебните отчети дават основа да избереш една проверима следваща стъпка.',12:'Ще избираш ИИ помощ според задачата, материала и начина за проверка. Работният образец продължава V-1. Подготовката, сверката и поправките участват в разчета заедно с генерирането; платен акаунт не е условие за учебните задачи.',13:'Ще превеждаш конкретен клиентски проблем в изпълнима услуга. V-1 е общият показан образец, а другите бизнеси имат собствени условия. Ще проследяваш предложение, уговорка, предаване, приемане и плащане, за да поемаш работа с ясен обхват.',14:'Ще доработваш историята и стила след уточнен бриф. V-1 показва как творческото решение променя кадър, ритъм или надпис, като пази фактите. Поправката се проверява в новия износ; предишното одобрение не се приписва автоматично на него.',15:'Ще събереш наученото от V-1 и ще го приложиш към отделните финални ситуации. Досието и казусът с пекарната са различни примери. Използвай фактите на конкретната задача, включително когато те изискват уточнение или отказ от неподходящ вариант.'}
def private_path(value):
 p=Path(value).resolve()
 if p.is_relative_to(ROOT):raise ValueError('Private files must remain outside git')
 return p
def clean(v):
 if isinstance(v,str):return v.replace('монтажна линия-а','монтажната линия').replace('в монтажна линия','в монтажната линия')
 if isinstance(v,list):return [clean(x) for x in v]
 if isinstance(v,dict):return {k:clean(x) for k,x in v.items()}
 return v
def build(source,cases):
 teaching={}
 for chunk in (Path(__file__).parent/'completion_teaching.txt').read_text().strip().split('\n\n'):
  lines=chunk.splitlines();assert len(lines)==3
  code,result=lines[0].split('|',1);teaching[code]=[result,*lines[1:]]
 assert len(teaching)==len(source)==73
 route=[f'pv{m:02}-{n:02}' for m,ns in ORDER.items() for n in ns]
 output=[]
 for oldrow in source:
  r=copy.deepcopy(oldrow);p=r['payload'];code=r['lessonId'];m=int(code[2:4]);result,body,record=teaching[code]
  blocks=p['blocks'];by={b['key']:b for b in blocks};o=by['objective'];c=o['content']
  first=c['body'].split('. ')[0].rstrip('.')+'.'
  c['body']=first+' Резултатът от работата е: '+result[0].lower()+result[1:]+'\n\n'+INTRO[m]
  task=by['practical_studio_final_20261015']['content']['studio'].get('task','Реши новия случай по предоставените условия.')
  c['deliverable']='Първо проследяваш показания V-1: '+result+' После решаваш отделната работна ситуация: '+task+' Избираш готови варианти и преценяваш промененото условие. Няма качване на файл, свободен писмен или числов отговор, външна публикация или задължителен платен акаунт.'
  c['check']='Проверяваме решенията по условията на отделните случаи. Изборът следва от даден факт; липсващото не се попълва по догадка. Работната задача е задължителна и при грешка получаваш обяснение за преглед. Преминаването показва преценка по учебни ситуации; не удостоверява собствено заснемане, клиентско приемане или доход.'
  assert o['points']==5 and len(c['outcomes'])>=5
  o['title']='Какво ще можеш след урока';p['objective']=c['body']
  if 'case' in by:
   by['case']['title']='Работен образец V-1';by['case']['content']={'body':'Измислен учебен пример. Числата и договорките са за обучение.\n\n'+body+'\n\nРезултат за следващата работа: '+result}
  else:
   assert m==15
   blocks.insert(2,dict(key='video_completion_record_v1',type='example',title='Какво пренасяш от V-1',content={'body':'Показан учебен образец, отделен от проверявания случай.\n\n'+body+'\n\n'+record},required=True,points=3))
  if 'worked_record' in by:by['worked_record']['content']={'body':'Учебен запис за досието V-1\n\n'+record}
  if code in cases:
   blocks.insert(next(i for i,b in enumerate(blocks) if b['type']=='course_exam' or b['key']=='summary'),copy.deepcopy(cases[code]))
   c['check']+=' Има и нов клиентски случай с пет решения и променено условие, отделен от показаното решение.'
  i=route.index(code)
  nextstep=f'Следва ({route[i+1]}): '+teaching[route[i+1]][0] if i+1<len(route) else 'След финалните проверки избери ограничена услуга и прегледай нейния бриф, цена и приемане. Запази учебното досие като образец; то не е реална клиентска поръчка.'
  by['summary']['content']={'takeaways':[result,record],'nextStep':nextstep}
  for b in blocks:b['content']=clean(b['content'])
  ai=by.get('video_ai_guide_20261019')
  if ai:
   guide=ai['content']['videoAi'];changed=False
   for t in guide['tools']:
    if t['id']=='flow':
     changed=True;t['limits']='За България провери регионалната наличност: според помощта на Flow редактирането на качени видеа и Avatars не са достъпни в ЕИП. Това е различно от генерирането на нов клип. Запази наличния редактор като резерв и провери модел, кредити и възрастови условия преди работа.'
     t['checkedAt']='2026-10-23';t['sources']=list(dict.fromkeys(t['sources']+['https://support.google.com/flow/answer/16353544?hl=en']))
   if changed:ai['content']['body']=guide['intro']+'\n\n'+'\n\n'.join(t['name']+' · '+t['accessLabel']+'\n'+t['purpose']+'\n'+t['limits']+'\n'+'\n'.join(f'{i+1}. {s}' for i,s in enumerate(t['steps']))+'\nПроверка: '+t['verification'] for t in guide['tools'])
  if code=='pv11-04':
   by['principle']['content']['body']+='\n\nВ текущото описание на YouTube views и engaged views са различни: първото включва старт на възпроизвеждане, второто — кликване за гледане или продължено гледане след началните секунди. Показатели като средна продължителност и задържане имат своя отчетна основа. Записвай точно име, формат, период и знаменател; не дели произволно общото време на всички стартирания.'
   by['reference']['content']['body']+='\n\nОпределения, сверени на 23.10.2026: https://blog.youtube/inside-youtube/engaged-views-youtube-explained/'
  if code=='pv11-06':by['reference']['content']['body']+='\n\nРъчните глави в YouTube изискват начало 00:00, поне три марки във възходящ ред и части с дължина поне 10 секунди. Провери достъпа до функцията. Източник, сверен на 23.10.2026: https://support.google.com/youtube/answer/9884579?hl=en'
  output.append(r)
 assert sum(len(r['payload']['blocks']) for r in output)==965
 return output
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--source',required=True);ap.add_argument('--cases',required=True);ap.add_argument('--output',required=True);a=ap.parse_args()
 result=build(json.loads(private_path(a.source).read_text()),json.loads(private_path(a.cases).read_text()))
 p=private_path(a.output);p.write_text(json.dumps(result,ensure_ascii=False));p.chmod(0o600);print('73 lessons; 965 blocks')
