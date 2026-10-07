/**
 * AVENZA — Custom Domain & Metadata Configuration
 * 
 * Safely resolves canonical URLs, Open Graph parameters,
 * and page metadata using VITE_SITE_URL or NEXT_PUBLIC_SITE_URL.
 */

export const getSiteBaseUrl = (): string => {
  // 1. Check Vite env variable
  const viteUrl = (import.meta as any).env?.VITE_SITE_URL;
  if (viteUrl && typeof viteUrl === 'string' && viteUrl.trim() !== '') {
    return viteUrl.trim().replace(/\/+$/, '');
  }

  // 2. Check Next/generic public env variable if defined
  const publicUrl = (import.meta as any).env?.NEXT_PUBLIC_SITE_URL;
  if (publicUrl && typeof publicUrl === 'string' && publicUrl.trim() !== '') {
    return publicUrl.trim().replace(/\/+$/, '');
  }

  // 3. Runtime browser window location origin fallback
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return '';
};

export const getCanonicalUrl = (pathname: string): string => {
  const base = getSiteBaseUrl();
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!base) return normalizedPath;
  return `${base}${normalizedPath === '/' ? '' : normalizedPath}`;
};

export interface PageMetadataOptions {
  title: string;
  description?: string;
  path: string;
}

export const updatePageMetadata = ({ title, description, path }: PageMetadataOptions): void => {
  if (typeof document === 'undefined') return;

  // Title
  document.title = title;

  const canonicalUrl = getCanonicalUrl(path);

  // Canonical Tag
  const canonicalEl = document.getElementById('avenza-canonical') as HTMLLinkElement | null;
  if (canonicalEl) {
    canonicalEl.href = canonicalUrl;
  }

  // Open Graph Title
  const ogTitleEl = document.getElementById('avenza-og-title') as HTMLMetaElement | null;
  if (ogTitleEl) {
    ogTitleEl.content = title;
  }

  // Open Graph URL
  const ogUrlEl = document.getElementById('avenza-og-url') as HTMLMetaElement | null;
  if (ogUrlEl) {
    ogUrlEl.content = canonicalUrl;
  }

  // Twitter Title
  const twitterTitleEl = document.getElementById('avenza-twitter-title') as HTMLMetaElement | null;
  if (twitterTitleEl) {
    twitterTitleEl.content = title;
  }

  // Optional Description
  if (description) {
    const descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (descEl) descEl.content = description;

    const ogDescEl = document.getElementById('avenza-og-desc') as HTMLMetaElement | null;
    if (ogDescEl) ogDescEl.content = description;

    const twDescEl = document.getElementById('avenza-twitter-desc') as HTMLMetaElement | null;
    if (twDescEl) twDescEl.content = description;
  }
};
