/** Locks or restores document body scroll (SSR-safe). */
export function setBodyScrollLocked(isBrowser: boolean, locked: boolean): void {
  if (!isBrowser) return;
  document.body.style.overflow = locked ? 'hidden' : '';
}

/** Logs a booking payload to the console in development (SSR-safe). */
export function logBookingPayloadInBrowser(
  isBrowser: boolean,
  groupTitle: string,
  payload: unknown,
  tableSummary?: Record<string, string | number | undefined>,
): void {
  if (!isBrowser) return;

  console.group(groupTitle);
  console.log('Full payload object:', payload);
  console.log('JSON (ready for API):', JSON.stringify(payload, null, 2));
  if (tableSummary) {
    console.table(tableSummary);
  }
  console.groupEnd();
}
