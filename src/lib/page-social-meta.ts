/** Keep sharing metadata in step with the current page; restore it on navigation. */
export function syncPageSocialMeta() {
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const url = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const values: [string, string][] = [
    ['meta[property="og:title"]', title],
    ['meta[property="og:description"]', description],
    ['meta[property="og:url"]', url],
    ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description],
  ];
  const previous = values.flatMap(([selector, content]) => {
    const element = document.querySelector(selector);
    if (!element) return [];
    const oldContent = element.getAttribute('content');
    element.setAttribute('content', content);
    return [{ element, oldContent }];
  });
  return () => {
    for (const { element, oldContent } of previous) {
      if (oldContent === null) element.removeAttribute('content');
      else element.setAttribute('content', oldContent);
    }
  };
}
