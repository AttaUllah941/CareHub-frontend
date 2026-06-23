import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DoctorPortalService } from '../services/doctor-portal.service';

export const doctorPortalGuard: CanActivateFn = () => {
  const portal = inject(DoctorPortalService);
  const router = inject(Router);
  if (portal.isLoggedIn()) return true;
  return router.createUrlTree(['/doctor/login']);
};

export const doctorGuestGuard: CanActivateFn = () => {
  const portal = inject(DoctorPortalService);
  const router = inject(Router);
  if (!portal.isLoggedIn()) return true;
  return router.createUrlTree(['/doctor/dashboard']);
};
