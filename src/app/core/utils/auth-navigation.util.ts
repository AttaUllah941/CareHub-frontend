import { UserRole } from '../models/auth.model';

/**
 * Validates in-app return URLs to prevent open redirects.
 */
export const isSafeInternalReturnUrl = (url: string | null | undefined): url is string =>
  typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

const PATIENT_ONLY_PREFIXES = [
  '/my-appointments',
  '/my-lab-tests',
  '/my-surgery-requests',
  '/my-prescriptions',
];

/**
 * Picks a safe post-login destination for the authenticated user's role.
 */
export const resolvePostLoginUrl = (
  role: UserRole,
  returnUrl: string | null | undefined,
  fallback: string,
): string => {
  if (!returnUrl || !isSafeInternalReturnUrl(returnUrl)) {
    return fallback;
  }

  if (
    returnUrl.startsWith('/admin') &&
    role !== UserRole.ADMIN &&
    role !== UserRole.SUPER_ADMIN
  ) {
    return fallback;
  }

  if (returnUrl.startsWith('/doctor') && role !== UserRole.DOCTOR) {
    return fallback;
  }

  if (
    PATIENT_ONLY_PREFIXES.some((prefix) => returnUrl === prefix || returnUrl.startsWith(`${prefix}/`)) &&
    role !== UserRole.PATIENT
  ) {
    return fallback;
  }

  return returnUrl;
};

export const dashboardRouteForRole = (role: UserRole | null | undefined): string => {
  if (!role) return '/';

  const routes: Partial<Record<UserRole, string>> = {
    [UserRole.SUPER_ADMIN]: '/admin/dashboard',
    [UserRole.ADMIN]: '/admin/dashboard',
    [UserRole.DOCTOR]: '/doctor/dashboard',
    [UserRole.PATIENT]: '/',
  };

  return routes[role] ?? '/';
};
