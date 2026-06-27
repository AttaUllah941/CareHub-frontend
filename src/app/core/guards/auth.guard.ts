import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
import { selectIsAuthenticated, selectUserRole } from '../../features/auth/store/auth.selectors';
import { ROLE_DASHBOARD_ROUTES } from '../../features/auth/store/auth.state';
import { isSafeInternalReturnUrl } from '../utils/auth-navigation.util';

/**
 * Protects routes that require authentication.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) return true;

      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
    }),
  );
};

/**
 * Redirects authenticated users away from guest-only pages (login/register).
 * Honors returnUrl when the user is already signed in.
 */
export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectUserRole),
  ]).pipe(
    take(1),
    map(([isAuthenticated, role]) => {
      if (!isAuthenticated) return true;

      const returnUrl = router.parseUrl(router.url).queryParams['returnUrl'];
      if (isSafeInternalReturnUrl(returnUrl)) {
        return router.parseUrl(returnUrl);
      }

      const destination = role ? ROLE_DASHBOARD_ROUTES[role] : '/';
      return router.createUrlTree([destination]);
    }),
  );
};
