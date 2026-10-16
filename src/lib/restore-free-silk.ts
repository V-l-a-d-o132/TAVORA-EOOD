import {completeLessonBlock,fetchLessonV2,type LessonProgressV2} from '@/lib/lesson-engine-v2';
import {closedBlockState} from '@/lib/closed-lesson-state';
import {FREE_SILK_LESSONS,readFreeSilkProgress,clearFreeSilkProgress} from '@/lib/free-silk-progress';

const acknowledgement = new Set(['objective','hook','rich_text','example','before_after','summary','step_reveal','concept','case_study']);
const defaultTransport = {fetchLesson:fetchLessonV2,grade:completeLessonBlock};

/** Replays only finite choices through the normal authenticated grader. Local
 * completion flags and XP are never submitted as account credit. */
export async function restoreFreeSilkToAccount(onProgress:(lesson:string,progress:LessonProgressV2)=>void,transport=defaultTransport) {
  let restored=0;const needsReview:string[]=[];
  for(const id of FREE_SILK_LESSONS){
    const lesson=await transport.fetchLesson('s01-m01',id),saved=readFreeSilkProgress(lesson);
    if(!saved?.completedBlockKeys.length)continue;
    let progress=lesson.progress;
    const done=new Set(progress?.completedBlockKeys||[]);
    for(const block of lesson.blocks.filter(b=>saved.completedBlockKeys.includes(b.key))){
      if(done.has(block.key))continue;
      const payload=acknowledgement.has(block.type)?{acknowledged:true}:closedBlockState(block,saved.blockState[block.key]);
      const response=await transport.grade(lesson,block,payload);
      if(response.progress){
        const p=response.progress;
        progress={currentBlockKey:typeof p.current_block_key==='string'?p.current_block_key:null,blockState:{},completedBlockKeys:Array.isArray(p.completed_block_keys)?p.completed_block_keys.filter((k):k is string=>typeof k==='string'):[],xp:typeof p.xp==='number'?p.xp:0,scorePercent:typeof p.score_percent==='number'?p.score_percent:null,masteryStatus:p.mastery_status==='mastered'?'mastered':p.mastery_status==='practicing'?'practicing':'learning',completedAt:typeof p.completed_at==='string'?p.completed_at:null,lastActivityAt:typeof p.last_activity_at==='string'?p.last_activity_at:null};
        progress.completedBlockKeys.forEach(k=>done.add(k));
      }
    }
    if(progress)onProgress(id,progress);
    if(progress&&saved.completedBlockKeys.every(k=>done.has(k))){clearFreeSilkProgress(lesson);restored++;}
    else needsReview.push(id);
  }
  return {restored,needsReview};
}
