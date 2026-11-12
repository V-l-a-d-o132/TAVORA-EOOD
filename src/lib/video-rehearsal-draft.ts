import { VIDEO_LAB_CHALLENGES } from '@/data/video-lab-challenges';
import type { VideoRehearsalState } from '@/components/academy/VideoLabChallenge';

const key = 'tavora:perfect-video:rehearsal:v1';

export function readRehearsal(): VideoRehearsalState {
  const state: VideoRehearsalState = {};
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw.length > 10000) return state;
    const saved = JSON.parse(raw);
    for (const pair of Object.values(VIDEO_LAB_CHALLENGES)) {
      let unlocked = true;
      for (const study of pair) {
        const answer = saved?.[study.id];
        const option = study.options.find(item => item.id === answer?.choice);
        if (option) state[study.id] = { choice: option.id, checked: unlocked && answer.checked === option.id ? option.id : '' };
        unlocked = !!option?.meetsGoal && state[study.id]?.checked === option.id;
      }
    }
  } catch { return {}; }
  return state;
}

export function saveRehearsal(state: VideoRehearsalState) {
  try { localStorage.setItem(key, JSON.stringify(state)); return true; } catch { return false; }
}
