import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildLabDocument, labHtml, labScript } from './document';

/** The same offline exercise also works on hosts that rewrite every URL to the SPA. */
export default function AcademyLabPage() {
  const frame = useRef<HTMLIFrameElement>(null);
  const document = useMemo(buildLabDocument, []);
  const [height, setHeight] = useState(1800);
  const [downloads, setDownloads] = useState<{ html: string; script: string } | null>(null);

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

  return <main className="min-h-screen bg-slate-50 text-slate-800">
    <nav aria-label="Учебно упражнение" className="mx-auto flex max-w-[960px] flex-wrap items-center gap-x-5 gap-y-2 px-5 pb-3 pt-6 text-sm">
      <Link to="/kurs" className="text-blue-700 underline underline-offset-4">Обратно към Академията</Link>
      {downloads && <>
        <a href={downloads.html} download="index.html" className="text-blue-700 underline underline-offset-4">Изтегли страницата</a>
        <a href={downloads.script} download="request-lab.js" className="text-blue-700 underline underline-offset-4">Изтегли логиката</a>
      </>}
    </nav>
    <iframe ref={frame} title="Учебна форма: какво се случва след Изпрати" srcDoc={document}
      sandbox="allow-scripts" className="block w-full border-0" style={{ height }} />
    <p className="mx-auto max-w-[960px] px-5 pb-6 text-sm leading-6 text-slate-600">За упражнението тук записите се пазят само докато страницата е отворена. За работа извън Академията изтегли двата файла в една папка.</p>
  </main>;
}
