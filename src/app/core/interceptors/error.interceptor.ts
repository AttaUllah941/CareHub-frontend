import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthActions } from '../../features/auth/store/auth.actions';

/**
 * Handles 401 responses by attempting token refresh, then retries the request.
 * On refresh failure, clears session and redirects to login.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authApi = inject(AuthApiService);
  const store = inject(Store);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clearTokens();
        store.dispatch(AuthActions.sessionExpired());
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url },
        });
        return throwError(() => error);
      }

      return authApi.refreshToken(refreshToken).pipe(
        switchMap((response) => {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          tokenStorage.setTokens(accessToken, newRefreshToken);
          store.dispatch(
            AuthActions.sessionTokensRefreshed({
              accessToken,
              refreshToken: newRefreshToken,
            }),
          );

          const clonedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          });
          return next(clonedReq);
        }),
        catchError((refreshError) => {
          tokenStorage.clearTokens();
          store.dispatch(AuthActions.sessionExpired());
          router.navigate(['/auth/login'], {
            queryParams: { returnUrl: router.url },
          });
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
