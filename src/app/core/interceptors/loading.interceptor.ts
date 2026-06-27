import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SKIP_LOADING } from '../api/http-context';
import { LoadingService } from '../services/loading.service';

/**
 * Tracks in-flight HTTP requests for a global loading indicator.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);

  loadingService.start();

  return next(req).pipe(finalize(() => loadingService.stop()));
};
