/**
 * Validates in-app return URLs to prevent open redirects.
 */
export const isSafeInternalReturnUrl = (url: string | null | undefined): url is string =>
  typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');
