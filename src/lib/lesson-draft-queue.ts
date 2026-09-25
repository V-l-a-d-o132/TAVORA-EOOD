import type { JsonObject } from './lesson-engine-v2';

type Drafts = Record<string, JsonObject>;
export type DraftSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// One queue belongs to one user, lesson and version. Navigation updates the
// cursor without replacing a different block's unsaved text with an empty value.
export class LessonDraftQueue {
  private pending: Drafts = {};
  private cursor: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running: Promise<boolean> | null = null;
  private persist: (cursor: string, state: Drafts) => Promise<unknown>;
  private status: (status: DraftSaveStatus) => void;

  constructor(
    persist: (cursor: string, state: Drafts) => Promise<unknown>,
    status: (status: DraftSaveStatus) => void,
  ) {
    this.persist = persist;
    this.status = status;
  }

  enqueue(cursor: string, state?: JsonObject) {
    this.cursor = cursor;
    if (state !== undefined) this.pending[cursor] = state;
    this.status('saving');
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { void this.flush(); }, 650);
  }

  async flush(): Promise<boolean> {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (this.running) {
      const saved = await this.running;
      return saved ? this.flush() : false;
    }
    if (!this.cursor) return true;
    const cursor = this.cursor;
    const snapshot = this.pending;
    this.cursor = null;
    this.pending = {};
    this.status('saving');
    this.running = this.persist(cursor, snapshot).then(() => {
      this.status(this.cursor ? 'saving' : 'saved');
      return true;
    }).catch(() => {
      // Keep the failed batch, but newer edits win for the same block.
      this.pending = { ...snapshot, ...this.pending };
      this.cursor ??= cursor;
      this.status('error');
      return false;
    });
    const saved = await this.running;
    this.running = null;
    return saved;
  }

  dispose() {
    this.status = () => {};
    // Flush while navigating to another lesson; don't silently cancel the draft.
    void this.flush();
  }
}
