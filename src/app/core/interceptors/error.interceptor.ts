import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { TokenStorageService } from '../services/token-storage.service';

/**
 * Handles 401 responses by attempting token refresh.
 * On refresh failure, clears tokens and redirects to login.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authApi = inject(AuthApiService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clearTokens();
        return throwError(() => error);
      }

      return authApi.refreshToken(refreshToken).pipe(
        switchMap((response) => {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          tokenStorage.setTokens(accessToken, newRefreshToken);

          const clonedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          });
          return next(clonedReq);
        }),
        catchError((refreshError) => {
          tokenStorage.clearTokens();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
