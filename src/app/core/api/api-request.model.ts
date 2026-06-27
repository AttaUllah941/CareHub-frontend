import { HttpContext } from '@angular/common/http';
import { SKIP_ERROR_TOAST, SKIP_LOADING } from './http-context';

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipErrorToast?: boolean;
  skipLoading?: boolean;
  context?: HttpContext;
}

export const buildRequestContext = (options?: ApiRequestOptions): HttpContext => {
  const context = options?.context ?? new HttpContext();

  if (options?.skipErrorToast) {
    context.set(SKIP_ERROR_TOAST, true);
  }

  if (options?.skipLoading) {
    context.set(SKIP_LOADING, true);
  }

  return context;
};
