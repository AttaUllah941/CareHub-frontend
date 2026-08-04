import { resolveAssetUrl } from './asset-url.util';

export type FacilityImageKind = 'hospital' | 'lab' | 'pharmacy' | 'surgery';

export const FACILITY_FALLBACK_IMAGES: Record<FacilityImageKind, string> = {
  hospital: '/images/facilities/hospital.svg',
  surgery: '/images/facilities/hospital.svg',
  lab: '/images/facilities/lab.svg',
  pharmacy: '/images/facilities/pharmacy.svg',
};

/** First non-empty image URL, resolved against the API origin when relative. */
export const resolveFacilityImageUrl = (
  images?: Array<string | null | undefined>,
  fallback?: string,
  existing?: string | null,
): string => {
  const candidates = [...(images ?? []), existing];
  const raw = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);

  if (!raw) {
    return fallback ?? '';
  }

  const trimmed = raw.trim();
  // Keep app-local assets (e.g. /images/facilities/*.svg) on the frontend origin.
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }

  return resolveAssetUrl(trimmed);
};

/**
 * Shrink remote CDN URLs for card/detail surfaces so listings fetch lighter assets.
 * Local/SVG URLs are returned unchanged.
 */
export const optimizeFacilityImageUrl = (url: string, width: number): string => {
  if (!url || url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }

  try {
    if (url.includes('images.unsplash.com')) {
      const parsed = new URL(url);
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('q', '70');
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      return parsed.toString();
    }

    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      // Skip if a transformation segment is already present after /upload/
      if (/\/upload\/(?:[^/]+,)+/.test(url) || /\/upload\/f_auto/.test(url)) {
        return url;
      }
      return url.replace('/upload/', `/upload/f_auto,q_auto:eco,w_${width},c_fill/`);
    }
  } catch {
    return url;
  }

  return url;
};
