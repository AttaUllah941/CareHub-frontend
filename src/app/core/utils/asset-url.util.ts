import { environment } from '../../../environments/environment';

/** Converts a backend-relative asset path (e.g. /uploads/…) to an absolute URL for API validators. */
export const resolveAssetUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const origin = environment.socketUrl.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
};
