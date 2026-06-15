import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ANALYTICS_FEATURE_KEY, AnalyticsState } from './analytics.state';

export const selectAnalyticsState = createFeatureSelector<AnalyticsState>(ANALYTICS_FEATURE_KEY);

export const selectAnalyticsOverview = createSelector(selectAnalyticsState, (s) => s.overview);
export const selectAnalyticsQuery = createSelector(selectAnalyticsState, (s) => s.query);
export const selectAnalyticsLoading = createSelector(selectAnalyticsState, (s) => s.loading);
export const selectAnalyticsError = createSelector(selectAnalyticsState, (s) => s.error);

export const selectRevenueTrend = createSelector(selectAnalyticsOverview, (o) => o?.revenue ?? null);
export const selectDoctorGrowth = createSelector(selectAnalyticsOverview, (o) => o?.doctors ?? null);
export const selectPatientGrowth = createSelector(selectAnalyticsOverview, (o) => o?.patients ?? null);
export const selectAppointmentGrowth = createSelector(selectAnalyticsOverview, (o) => o?.appointments ?? null);
