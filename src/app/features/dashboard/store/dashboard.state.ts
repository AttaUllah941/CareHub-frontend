import { AdminDashboardStats } from '../../../core/models/dashboard.model';

export interface DashboardState {
  adminStats: AdminDashboardStats | null;
  loading: boolean;
  error: string | null;
}

export const DASHBOARD_FEATURE_KEY = 'dashboard';

export const initialDashboardState: DashboardState = {
  adminStats: null,
  loading: false,
  error: null,
};
