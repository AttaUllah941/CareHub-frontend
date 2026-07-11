import { User, UserRole } from '../../../core/models/auth.model';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  devResetToken: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: null,
  devResetToken: null,
};

export const AUTH_FEATURE_KEY = 'auth';

/** Post-login landing routes per role */
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '/admin/dashboard',
  [UserRole.ADMIN]: '/admin/dashboard',
  [UserRole.DOCTOR]: '/doctor/dashboard',
  [UserRole.PATIENT]: '/',
  [UserRole.CLINIC_MANAGER]: '/',
  [UserRole.PHARMACY]: '/',
  [UserRole.LAB]: '/',
};
