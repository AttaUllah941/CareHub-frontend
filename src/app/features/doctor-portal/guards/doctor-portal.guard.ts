import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/** Legacy /doctor/login → unified auth with doctor dashboard return target */
export const doctorLoginRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: '/doctor/dashboard' },
  });
};
