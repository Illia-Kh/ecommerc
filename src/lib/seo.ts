export function canonical(url: string) {
  return process.env.SITE_URL + url;
}

export function hreflang(urlCs: string, urlUk: string) {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  
  return [
    {
      rel: 'alternate',
      hrefLang: 'cs',
      href: `${baseUrl}${urlCs}`,
    },
    {
      rel: 'alternate',
      hrefLang: 'uk',
      href: `${baseUrl}${urlUk}`,
    },
  ];
}