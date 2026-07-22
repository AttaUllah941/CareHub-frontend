import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
import { UserRole } from '../models/auth.model';
import {
  selectIsAuthenticated,
  selectUserRole,
} from '../../features/auth/store/auth.selectors';

/**
 * Restricts routes to one or more authenticated user roles.
 * Unauthenticated users are sent to login with returnUrl preserved.
 */
export const roleGuard = (...allowedRoles: UserRole[]): CanActivateFn => {
  return (_route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    return combineLatest([
      store.select(selectIsAuthenticated),
      store.select(selectUserRole),
    ]).pipe(
      take(1),
      map(([isAuthenticated, role]) => {
        if (!isAuthenticated) {
          return router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url },
          });
        }

        if (role && allowedRoles.includes(role)) {
          return true;
        }

        return router.createUrlTree(['/unauthorized']);
      }),
    );
  };
};

/** Doctor portal — JWT + DOCTOR role required */
export const doctorPortalGuard = roleGuard(UserRole.DOCTOR);

/** Pharmacy portal — JWT + PHARMACY role required */
export const pharmacyPortalGuard = roleGuard(UserRole.PHARMACY);

/** Admin area — ADMIN or SUPER_ADMIN (for future /admin routes) */
export const adminGuard = roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN);

/** Patient-only routes */
export const patientGuard = roleGuard(UserRole.PATIENT);
