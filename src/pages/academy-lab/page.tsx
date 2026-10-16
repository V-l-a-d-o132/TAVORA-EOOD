import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeSelector from '@/components/academy/ThemeSelector';
import { buildLabDocument, labHtml, labScript } from './document';
import { withPortableLabTheme } from '@/lib/portable-lab-theme';

/** The same offline exercise also works on hosts that rewrite every URL to the SPA. */
export default function AcademyLabPage() {
  const frame = useRef<HTMLIFrameElement>(null);
  const document = useMemo(buildLabDocument, []);
  const [height, setHeight] = useState(1800);
  const [downloads, setDownloads] = useState<{ html: string; script: string } | null>(null);
  const downloadComplete = () => {
    const url = URL.createObjectURL(new Blob([withPortableLabTheme(document)], { type: 'text/html;charset=utf-8' }));
    const link = window.document.createElement('a'); link.href = url; link.download = 'tavora-zayavki-lab.html'; window.document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  useEffect(() => {
    const html = URL.createObjectURL(new Blob([labHtml], { type: 'text/html;charset=utf-8' }));
    const script = URL.createObjectURL(new Blob([labScript], { type: 'text/javascript;charset=utf-8' }));
    setDownloads({ html, script });
    return () => { URL.revokeObjectURL(html); URL.revokeObjectURL(script); };
  }, []);

  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== 'tavora-lab-height') return;
      const next = event.data.height;
      if (typeof next === 'number' && Number.isFinite(next) && next >= 400 && next <= 12000) setHeight(next);
    };
    window.addEventListener('message', resize);
    return () => window.removeEventListener('message', resize);
  }, []);

  return <main className="min-h-screen academy-bg academy-text">
    <nav aria-label="Учебно упражнение" className="mx-auto flex max-w-[960px] flex-wrap items-center gap-x-5 gap-y-2 px-5 pb-3 pt-6 text-sm">
      <Link to="/kurs" className="academy-accent underline underline-offset-4">Обратно към Академията</Link>
      <button type="button" onClick={downloadComplete} className="rounded-lg border academy-border-strong px-3 py-2 academy-text">Изтегли цялата лаборатория · HTML</button>
      {downloads && <>
        <a href={downloads.html} download="index.html" className="academy-accent underline underline-offset-4">Изтегли страницата</a>
        <a href={downloads.script} download="request-lab.js" className="academy-accent underline underline-offset-4">Изтегли логиката</a>
      </>}
      <div className="ml-auto"><ThemeSelector /></div>
    </nav>
    <iframe ref={frame} title="Учебна форма: какво се случва след Изпрати" srcDoc={document}
      sandbox="allow-scripts allow-forms" className="block w-full border-0" style={{ height }} />
    <p className="mx-auto max-w-[960px] px-5 pb-6 text-sm leading-6 academy-muted">За упражнението тук записите се пазят само докато страницата е отворена. За работа без интернет изтегли цялата лаборатория като един HTML файл. Двата отделни файла са налични и за разглеждане на устройството.</p>
  </main>;
}
