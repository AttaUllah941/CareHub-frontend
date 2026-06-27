import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SKIP_ERROR_TOAST } from '../api/http-context';
import { ApiErrorService } from '../services/api-error.service';
import { NotificationService } from '../services/notification.service';

/**
 * Surfaces non-auth API errors via the global notification service.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const apiErrorService = inject(ApiErrorService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.context.get(SKIP_ERROR_TOAST)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        return throwError(() => error);
      }

      const message = apiErrorService.getMessage(error);

      if (error.status === 403) {
        notificationService.showError(message);
        router.navigate(['/unauthorized']);
        return throwError(() => error);
      }

      if (error.status >= 500 || error.status === 0) {
        notificationService.showError(message);
      } else if (error.status >= 400 && !apiErrorService.isValidationError(error)) {
        notificationService.showError(message);
      }

      return throwError(() => error);
    }),
  );
};
