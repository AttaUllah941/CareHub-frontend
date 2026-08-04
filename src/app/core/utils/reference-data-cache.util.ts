import { isPlatformBrowser } from '@angular/common';

export interface ReferenceCacheEnvelope<T> {
  version: number;
  savedAt: number;
  data: T;
}

const CACHE_VERSION = 1;

/** 24 hours — specialties/languages change rarely. */
export const REFERENCE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const SPECIALTIES_CACHE_KEY = 'carehub.ref.specialties.v1';
export const LANGUAGES_CACHE_KEY = 'carehub.ref.languages.v1';

export function readReferenceCache<T>(platformId: object, key: string): T | null {
  if (!isPlatformBrowser(platformId)) return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ReferenceCacheEnvelope<T>;
    if (!parsed || parsed.version !== CACHE_VERSION || !Array.isArray(parsed.data as unknown[])) {
      localStorage.removeItem(key);
      return null;
    }

    // Return even if TTL expired — callers revalidate in the background (SWR).
    return parsed.data;
  } catch {
    return null;
  }
}

export function isReferenceCacheFresh(
  platformId: object,
  key: string,
  ttlMs = REFERENCE_CACHE_TTL_MS,
): boolean {
  if (!isPlatformBrowser(platformId)) return false;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as ReferenceCacheEnvelope<unknown>;
    return (
      !!parsed &&
      parsed.version === CACHE_VERSION &&
      Date.now() - parsed.savedAt <= ttlMs
    );
  } catch {
    return false;
  }
}

export function writeReferenceCache<T>(platformId: object, key: string, data: T): void {
  if (!isPlatformBrowser(platformId)) return;

  try {
    const envelope: ReferenceCacheEnvelope<T> = {
      version: CACHE_VERSION,
      savedAt: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Quota / private mode — ignore; in-memory cache still works.
  }
}
