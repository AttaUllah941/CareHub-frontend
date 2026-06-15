import { createReducer, on } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { initialDashboardState } from './dashboard.state';

export const dashboardReducer = createReducer(
  initialDashboardState,

  on(DashboardActions.loadAdminStats, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DashboardActions.loadAdminStatsSuccess, (state, { stats }) => ({
    ...state,
    adminStats: stats,
    loading: false,
  })),
  on(DashboardActions.loadAdminStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(DashboardActions.clearError, (state) => ({ ...state, error: null })),
);
