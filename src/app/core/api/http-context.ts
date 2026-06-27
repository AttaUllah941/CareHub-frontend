import { HttpContextToken } from '@angular/common/http';

/** Skip the global API error toast for this request */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

/** Skip the global loading indicator for this request */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);
