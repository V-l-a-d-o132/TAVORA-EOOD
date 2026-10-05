import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

// Render only the curated public editorial pages. The build never starts an
// authenticated session, reads student data or contacts a production service.
const authStub = '\0editorial-anonymous-auth';
const server = await createServer({
  mode: 'production',
  server: { middlewareMode: true },
  appType: 'custom',
  plugins: [{
    name: 'editorial-build-anonymous-auth',
    enforce: 'pre',
    resolveId(id) {
      if (id === '@/contexts/AuthContext' || /\/src\/contexts\/AuthContext(?:\.tsx)?$/.test(id)) return authStub;
    },
    load(id) {
      if (id === authStub) return 'export const useAuth = () => ({ user: null, signOut: async () => {} });';
    },
  }],
});

try {
  const { SILK_ROAD_ARTICLES } = await server.ssrLoadModule('/src/pages/blog/silk-road-articles.ts');
  const { CONSUMER_RIGHTS_ARTICLES } = await server.ssrLoadModule('/src/pages/blog/consumer-rights-articles.ts');
  const articles = [...SILK_ROAD_ARTICLES, ...CONSUMER_RIGHTS_ARTICLES];
  const { buildArticleSchema } = await server.ssrLoadModule('/src/pages/blog/components/BlogArticleLayout.tsx');
  const { EDITORIAL_IMAGE_URL, EDITORIAL_IMAGE_ALT } = await server.ssrLoadModule('/src/config/editorial-image.ts');
  const template = await readFile(resolve('out/index.html'), 'utf8');
  for (const article of articles) {
    const path = `/blog/${article.id}`;
    const canonical = `https://imashnujnoto.com${path}`;
    const { default: Page } = await server.ssrLoadModule(`/src/pages/blog/${article.id}/page.tsx`);
    const base = process.env.BASE_PATH || '/';
    const entry = `${base.replace(/\/$/, '')}${path}`;
    const markup = renderToStaticMarkup(createElement(MemoryRouter, { basename: base, initialEntries: [entry] }, createElement(Page)));
    const document = new JSDOM(template).window.document;
    document.title = article.seoTitle;
    document.querySelector('link[rel="canonical"]').href = canonical;
    const setMeta = (attribute, key, value) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
      element.content = value;
    };
    for (const [attribute, key, value] of [
      ['name', 'description', article.description],
      ['name', 'robots', 'index,follow,max-image-preview:large'],
      ['property', 'og:title', article.seoTitle],
      ['property', 'og:description', article.description],
      ['property', 'og:url', canonical],
      ['property', 'og:type', 'article'],
      ['property', 'og:image', EDITORIAL_IMAGE_URL],
      ['property', 'og:image:alt', EDITORIAL_IMAGE_ALT],
      ['property', 'og:image:width', '2048'],
      ['property', 'og:image:height', '1154'],
      ['name', 'twitter:title', article.seoTitle],
      ['name', 'twitter:description', article.description],
      ['name', 'twitter:image', EDITORIAL_IMAGE_URL],
    ]) setMeta(attribute, key, value);
    const schema = buildArticleSchema({
      id: article.id, name: article.title, description: article.description,
      image: EDITORIAL_IMAGE_URL, section: article.category,
      keywords: article.keywords.join(', '), datePublished: '2026-10-05', dateModified: '2026-10-05', breadcrumbLabel: article.title,
    });
    const schemaEl = document.createElement('script');
    schemaEl.id = `schema-${article.id}`;
    schemaEl.type = 'application/ld+json';
    schemaEl.textContent = JSON.stringify(schema).replace(/</g, '\\u003c');
    document.head.append(schemaEl);
    const pageSchema = document.getElementById('schema-site-page');
    if (pageSchema) {
      const data = JSON.parse(pageSchema.textContent);
      Object.assign(data, { '@id': `${canonical}#webpage`, url: canonical, name: article.seoTitle, description: article.description });
      pageSchema.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    }
    const root = document.getElementById('root');
    root.dataset.editorialPath = path;
    root.innerHTML = markup;
    const directory = resolve(`out/blog/${article.id}`);
    await mkdir(directory, { recursive: true });
    const html = `<!DOCTYPE html>\n${document.documentElement.outerHTML}\n`;
    await writeFile(resolve(directory, 'index.html'), html);
    // Vite's extensionless HTML fallback checks /slug.html before the SPA
    // index; directory index files support hosts using /slug/ resolution.
    await writeFile(resolve(`out/blog/${article.id}.html`), html);
  }
  console.log(`Prerendered ${articles.length} public articles with complete text, links and metadata.`);
} finally {
  await server.close();
}
