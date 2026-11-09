/** Resolves a file inside public/assets, respecting Vite's base path. */
export const asset = (path) => `${import.meta.env.BASE_URL}assets/${path.replace(/^\/+/, '')}`;

/** Natural ("human") string compare: "photo 2" < "photo 10". */
export const naturalCompare = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

