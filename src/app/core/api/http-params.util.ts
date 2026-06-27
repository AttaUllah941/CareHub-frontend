import { HttpParams } from '@angular/common/http';

/**
 * Builds HttpParams from a flat query object, omitting empty values.
 */
export const buildHttpParams = (
  query: Record<string, string | number | boolean | undefined | null>,
): HttpParams => {
  let params = new HttpParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params = params.set(key, String(value));
    }
  });

  return params;
};
