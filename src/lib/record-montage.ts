import { coffee, seconds, type MontageShot, type MontageSource } from './video-montage';

const width = 720, height = 1280;
const alternate = 'Можеш да свалиш монтажния лист и SRT за своя редактор.';

function during(target: EventTarget, event: string, start: () => void | Promise<void>, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const finish = (error?: Error) => {
      clearTimeout(timer);
      target.removeEventListener(event, done);
      target.removeEventListener('error', failed);
      signal.removeEventListener('abort', abort);
      if (error) reject(error); else resolve();
    };
    const done = () => finish();
    const failed = () => finish(new Error('Браузърът не можа да отвори или възпроизведе този запис. ' + alternate));
    const abort = () => finish(signal.reason);
    const timer = setTimeout(failed, 12000);
    target.addEventListener(event, done);
    target.addEventListener('error', failed);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { abort(); return; }
    try { Promise.resolve(start()).catch(failed); } catch { failed(); }
  });
}

function draw(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, shot: MontageShot) {
  const scale = (shot.framing === 'fill' ? Math.max : Math.min)(width / video.videoWidth, height / video.videoHeight);
  const w = video.videoWidth * scale, h = video.videoHeight * scale;
  ctx.fillStyle = '#131815';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(video, (width - w) / 2, (height - h) / 2, w, h);

  ctx.font = '600 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lines: string[] = [];
  let line = '';
  for (const word of shot.caption.trim().split(/\s+/u)) {
    const next = line ? line + ' ' + word : word;
    if (line && ctx.measureText(next).width > width * 0.76) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  const bottom = height * 0.84, lineHeight = 52;
  const top = bottom - lines.length * lineHeight;
  ctx.fillStyle = 'rgba(0,0,0,.82)';
  ctx.fillRect(width * 0.08, top - 10, width * 0.84, lines.length * lineHeight + 20);
  ctx.fillStyle = '#fff';
  lines.forEach((text, i) => ctx.fillText(text, width / 2, top + (i + 0.5) * lineHeight, width * 0.78));
}

function playUntil(video: HTMLVideoElement, end: number, paint: () => void, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    let frame = 0;
    const finish = (error?: Error) => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      if (error) reject(error); else resolve();
    };
    const abort = () => finish(signal.reason);
    const timer = setTimeout(() => finish(new Error('Кадърът спря преди края. Провери източника и опитай пак.')), (end - video.currentTime + 12) * 1000);
    const tick = () => {
      try {
        paint();
        if (video.currentTime >= end || (video.ended && end <= video.currentTime + 0.1)) finish();
        else if (video.ended || video.error) finish(new Error('Записът свърши преди избрания край.'));
        else frame = requestAnimationFrame(tick);
      } catch { finish(new Error('Кадърът прекъсна по време на износа. ' + alternate)); }
    };
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort(); else tick();
  });
}

export async function recordMontage(shots: MontageShot[], sources: Map<string, MontageSource>, cancel: AbortSignal, progress: (seconds: number) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  if (typeof MediaRecorder === 'undefined' || !canvas.captureStream) throw new Error('Тук записът на монтаж в браузъра е недостъпен. ' + alternate);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Браузърът не може да подготви картината. ' + alternate);
  const withSound = shots.some(shot => shot.source !== coffee.id);
  if (withSound && typeof AudioContext === 'undefined') throw new Error('Тук звукът от личен клип не може да се изнесе. ' + alternate);
  const avc = 'video/mp4;codecs=avc1.42E01F';
  const types = withSound ? [avc + ',mp4a.40.2', 'video/webm;codecs=vp8,opus', 'video/mp4', 'video/webm'] : [avc, 'video/mp4', 'video/webm;codecs=vp8', 'video/webm'];
  const mime = types.find(type => MediaRecorder.isTypeSupported(type));
  if (!mime) throw new Error('Няма наличен формат за запис. ' + alternate);

  const stream = canvas.captureStream(25);
  const player = document.createElement('video');
  player.playsInline = true;
  player.preload = 'auto';
  player.muted = !withSound;
  const controller = new AbortController(), signal = controller.signal;
  const abort = () => controller.abort(new Error('Записът е спрян. Можеш да продължиш от монтажния лист.'));
  const hidden = () => { if (document.hidden) controller.abort(new Error('Разделът беше скрит. Започни износа отново и остани тук до края.')); };
  cancel.addEventListener('abort', abort);
  document.addEventListener('visibilitychange', hidden);
  let audio: AudioContext | undefined, recorder: MediaRecorder | undefined;
  try {
    if (cancel.aborted) abort();
    hidden();
    signal.throwIfAborted();
    if (withSound) {
      audio = new AudioContext();
      const destination = audio.createMediaStreamDestination();
      audio.createMediaElementSource(player).connect(destination);
      destination.stream.getAudioTracks().forEach(track => stream.addTrack(track));
      if (audio.state !== 'running') {
        await during(audio, 'statechange', () => audio.resume(), signal);
        if (String(audio.state) !== 'running') throw new Error('Звукът не можа да стартира. ' + alternate);
      }
    }
    recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2400000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.onerror = () => controller.abort(new Error('Записът прекъсна. Опитай отново. ' + alternate));
    let sourceId: string, elapsed = 0, previousSecond = -1;
    for (const [index, shot] of shots.entries()) {
      const source = sources.get(shot.source);
      if (!source) throw new Error(`Избери отново файла за кадър ${index + 1}.`);
      const from = seconds(shot.from), to = seconds(shot.to);
      if (source.id !== sourceId) {
        await during(player, 'loadeddata', () => { player.src = source.url; player.load(); }, signal);
        sourceId = source.id;
      }
      if (!player.videoWidth || !Number.isFinite(player.duration) || to > player.duration + 0.001) {
        throw new Error(`Краят на кадър ${index + 1} е извън използваемия запис.`);
      }
      if (Math.abs(player.currentTime - from) > 0.001) {
        await during(player, 'seeked', () => { player.currentTime = from; }, signal);
      }
      draw(ctx, player, shot);
      await during(player, 'playing', () => player.play(), signal);
      if (index === 0) recorder.start(); else recorder.resume();
      await playUntil(player, to, () => {
        draw(ctx, player, shot);
        const current = Math.floor(elapsed + Math.max(0, Math.min(to, player.currentTime) - from));
        if (current !== previousSecond) { progress(current); previousSecond = current; }
      }, signal);
      player.pause();
      elapsed += to - from;
      if (index < shots.length - 1) recorder.pause();
    }
    await during(recorder, 'stop', () => recorder.stop(), signal);
    const file = new Blob(chunks, { type: recorder.mimeType || mime });
    if (!file.size) throw new Error('Получен е празен файл. Повтори износа.');
    return file;
  } finally {
    cancel.removeEventListener('abort', abort);
    document.removeEventListener('visibilitychange', hidden);
    player.pause();
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    stream.getTracks().forEach(track => track.stop());
    player.removeAttribute('src');
    player.load();
    if (audio) await audio.close().catch(() => undefined);
  }
}
