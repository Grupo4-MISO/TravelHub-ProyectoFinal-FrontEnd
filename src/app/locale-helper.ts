export type Locale = 'es' | 'en';

export function getCurrentLocale(): Locale {
  const path = window.location.pathname;
  if (path.startsWith('/en/') || path === '/en') {
    return 'en';
  }
  const saved = localStorage.getItem('locale');
  if (saved === 'en' || saved === 'es') {
    return saved;
  }
  return 'es';
}

function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; max-age=${days * 86400}; SameSite=Lax`;
}

export function changeLanguage(lang: Locale): void {
  const current = getCurrentLocale();
  if (current === lang) return;

  localStorage.setItem('locale', lang);
  setCookie('locale', lang, 365);

  const { pathname, search, hash } = window.location;

  const hasLocalePrefix = pathname.startsWith('/en/') || pathname === '/en' || pathname.startsWith('/es/') || pathname === '/es';

  if (hasLocalePrefix) {
    let newPath: string;
    if (lang === 'en') {
      newPath = pathname === '/' || pathname === '/es' ? '/en' : pathname.replace(/^\/es/, '/en');
    } else {
      newPath = pathname === '/' || pathname === '/en' ? '/' : pathname.replace(/^\/en/, '');
      if (!newPath) newPath = '/';
    }
    window.location.href = newPath + search + hash;
  } else {
    window.location.reload();
  }
}
