import { useEffect, useState } from 'react';
import { hasWebPHeader, providedImageSize, SILK_IMAGE_QUALITIES, SILK_IMAGE_WIDTHS, type ImageQuality, type ImageWidth } from '@/lib/silk-image-workbench';

const sources = [{ id: 'coffee', label: 'Снимка на кафемашина', url: '/academy-labs/perfect-video/practical/coffee-poster.jpg' },
  { id: 'advert', label: 'Учебна обява с текст', url: '/academy-labs/silk-road/toolkit/advert.svg' }];
type Output = { requestKey: string; url: string; sourceUrl: string; blob: Blob; sourceBytes: number; width: number; height: number; quality: number; filename: string };
const number = (value: number) => new Intl.NumberFormat('bg-BG').format(value);
const selectClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-raised px-3 py-3 text-sm academy-text focus:outline-none focus:ring-2 focus:ring-red-400';

export default function SilkImageWorkbench() {
  const [sourceId, setSourceId] = useState('coffee');
  const [width, setWidth] = useState<ImageWidth>(480);
  const [quality, setQuality] = useState<ImageQuality>(0.72);
  const [encoded, setOutput] = useState<Output | null>(null);
  const [failure, setError] = useState<{ requestKey: string; message: string } | null>(null);
  const source = sources.find(item => item.id === sourceId)!;
  const requestKey = `${source.id}/${width}/${quality}`;
  const output = encoded?.requestKey === requestKey ? encoded : null;
  const error = failure?.requestKey === requestKey ? failure.message : '';
  useEffect(() => {
    let cancelled = false, sourceObjectUrl = '', outputObjectUrl = '';
    setOutput(null); setError(null);
    const encode = async () => {
      try {
        const response = await fetch(source.url, { cache: 'force-cache' });
        if (!response.ok) throw Error('Предоставеното изображение не се зареди. Опитай отново след презареждане.');
        const original = await response.blob();
        if (cancelled) return;
        sourceObjectUrl = URL.createObjectURL(original);
        const image = new Image(); image.src = sourceObjectUrl; await image.decode();
        if (cancelled) return;
        const size = providedImageSize(image.naturalWidth, image.naturalHeight, width);
        const canvas = document.createElement('canvas'); canvas.width = size.width; canvas.height = size.height;
        const context = canvas.getContext('2d'); if (!context) throw Error('Браузърът не предоставя нужната локална обработка. Ръководството и предоставените задачи остават достъпни.');
        context.drawImage(image, 0, 0, size.width, size.height);
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', quality));
        if (cancelled) return;
        if (!blob || blob.type !== 'image/webp' || !hasWebPHeader(new Uint8Array(await blob.arrayBuffer()))) throw Error('Този браузър не изнася WebP. Използвай описания маршрут в Squoosh; задачата не изисква собствен файл.');
        if (cancelled) return;
        outputObjectUrl = URL.createObjectURL(blob);
        setOutput({ requestKey, url: outputObjectUrl, sourceUrl: sourceObjectUrl, blob, sourceBytes: original.size, ...size, quality, filename: `tavora-${source.id}-${size.width}-q${Math.round(quality * 100)}.webp` });
      } catch (cause) { if (!cancelled) setError({ requestKey, message: cause instanceof Error && !(cause instanceof TypeError) ? cause.message : 'Изображението не се обработи. Опитай отново след презареждане.' }); }
    };
    void encode();
    return () => { cancelled = true; if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl); if (outputObjectUrl) URL.revokeObjectURL(outputObjectUrl); };
  }, [source.url, source.id, width, quality, requestKey]);

  return <section id="webp" aria-label="Лаборатория: изображение за уеб" className="my-6 min-w-0 scroll-mt-6 rounded-2xl border academy-border-strong p-4 sm:p-6">
    <h2 className="text-xl font-semibold academy-text">Подготви предоставено изображение</h2>
    <p className="mt-3 text-sm leading-7 academy-body">Избери размер и качество и сравни резултата. Браузърът действително създава WebP на устройството ти. Работиш само с тези предоставени изображения. Файлът може да бъде изтеглен за собствен преглед.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <label className="text-sm academy-text">Предоставено изображение<select className={selectClass} value={sourceId} onChange={event => setSourceId(event.target.value)}>{sources.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label className="text-sm academy-text">Ширина<select className={selectClass} value={width} onChange={event => setWidth(Number(event.target.value) as ImageWidth)}>{SILK_IMAGE_WIDTHS.map(value => <option key={value} value={value}>{value} px</option>)}</select></label>
      <label className="text-sm academy-text">Качество<select className={selectClass} value={quality} onChange={event => setQuality(Number(event.target.value) as ImageQuality)}>{SILK_IMAGE_QUALITIES.map(value => <option key={value} value={value}>{Math.round(value * 100)} / 100</option>)}</select></label>
    </div>
    {error && <p role="alert" className="mt-4 rounded-lg border academy-warning-border academy-warning-bg p-4 text-sm leading-7 academy-warning">{error}</p>}
    {!output && !error && <p role="status" className="mt-4 text-sm academy-body">Подготовка на изображението…</p>}
    {output && <>
      <dl aria-live="polite" aria-label="Действителни свойства на изходния файл" className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div><dt className="academy-muted">Формат и размери</dt><dd className="mt-1 font-semibold academy-text">WebP · {output.width} × {output.height} px</dd></div>
        <div><dt className="academy-muted">Оригинал</dt><dd className="mt-1 academy-text">{number(output.sourceBytes)} байта</dd></div>
        <div><dt className="academy-muted">Изходен файл</dt><dd data-testid="webp-bytes" className="mt-1 font-semibold academy-text">{number(output.blob.size)} байта</dd></div>
      </dl>
      <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2"><figure><img src={output.sourceUrl} alt={`Оригинал: ${source.label}`} className="h-auto max-h-80 w-full rounded-lg object-contain" /><figcaption className="mt-2 text-xs academy-muted">Предоставен оригинал</figcaption></figure><figure><img src={output.url} alt={`WebP: ${source.label}`} className="h-auto max-h-80 w-full rounded-lg object-contain" /><figcaption className="mt-2 text-xs academy-muted">Действителен WebP · качество {Math.round(output.quality * 100)}</figcaption></figure></div>
      <details className="mt-4 rounded-lg border academy-border p-3"><summary className="cursor-pointer text-sm font-semibold academy-text">Разгледай WebP в действителния пикселен размер</summary><div className="mt-3 overflow-x-auto" role="region" tabIndex={0} aria-label="Преглед на изображението 1 към 1"><img src={output.url} alt="Детайл от изходния файл в действителен размер" style={{ width: output.width, height: output.height, maxWidth: 'none' }} /></div></details>
      <p role="status" className="mt-4 text-sm leading-7 academy-body">{output.blob.size < output.sourceBytes ? 'Файлът е по-малък от предоставения оригинал. Провери и детайла и нужните размери, преди да го избереш.' : 'Този WebP е по-голям от предоставения оригинал. Прецени друго качество или формат; конвертирането само по себе си не гарантира намаляване.'}</p>
      <a href={output.url} download={output.filename} className="mt-4 inline-block rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400">Изтегли този WebP</a>
    </>}
    <p className="mt-4 text-xs leading-6 academy-muted">Тук няма качване или оценяване на собствен файл. Решенията се проверяват отделно в урока. Примерът е локална лаборатория, а не вграден интерфейс на Squoosh.</p>
    <p className="mt-2 text-xs leading-6 academy-muted">Снимката на кафемашината е от предоставения учебен запис на Kjetil_r, public domain. Обявата е авторски измислен учебен материал на TAVORA.</p>
  </section>;
}
