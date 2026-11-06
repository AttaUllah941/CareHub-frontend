/** Locks or restores document body scroll (SSR-safe). */
export function setBodyScrollLocked(isBrowser: boolean, locked: boolean): void {
  if (!isBrowser) return;
  document.body.style.overflow = locked ? 'hidden' : '';
}
