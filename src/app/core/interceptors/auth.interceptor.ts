import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { PUBLIC_AUTH_PATHS } from '../services/auth-api.service';

/**
 * JWT interceptor — attaches Bearer access token to protected API requests.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const token = tokenStorage.getAccessToken();
  const isPublicAuthRoute = PUBLIC_AUTH_PATHS.some((path) => req.url.includes(path));

  if (token && !isPublicAuthRoute) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
