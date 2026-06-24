import { ParamMap } from '@angular/router';

export const DEFAULT_CITY_SLUG = 'lahore';

export function citySlugFromParamMap(params: ParamMap): string {
  return params.get('citySlug') ?? DEFAULT_CITY_SLUG;
}
