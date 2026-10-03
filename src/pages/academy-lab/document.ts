import labHtml from '../../../public/academy-labs/silk-road/index.html?raw';
import labScript from '../../../public/academy-labs/silk-road/request-lab.js?raw';

export { labHtml, labScript };

export function buildLabDocument() {
  const script = labScript.replace(/<\/script/gi, '<\\/script');
  const heightScript = `
    const reportHeight = () => parent.postMessage({type:'tavora-lab-height',height:Math.ceil(document.querySelector('main').getBoundingClientRect().height)}, '*');
    new ResizeObserver(reportHeight).observe(document.querySelector('main'));
    reportHeight();`;
  return labHtml
    .replace(/<p><a href="index\.html"[\s\S]*?<\/p>/, '')
    .replace(/<p class="small"><a href="https:\/\/imashnujnoto\.com\/kurs"[\s\S]*?<\/p>/, '')
    .replace('<script src="request-lab.js"></script>', `<script>${script}\n${heightScript}</script>`);
}
