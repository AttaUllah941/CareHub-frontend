import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { UserRole } from '../models/auth.model';
import { selectUserRole } from '../../features/auth/store/auth.selectors';

/**
 * Factory for role-based route guards.
 * Usage: canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])]
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectUserRole).pipe(
      take(1),
      map((role) => {
        if (role && allowedRoles.includes(role)) return true;
        return router.createUrlTree(['/unauthorized']);
      }),
    );
  };
};
