import { createFeatureSelector, createSelector } from '@ngrx/store';
import { REPORTS_FEATURE_KEY, ReportsState } from './reports.state';

export const selectReportsState = createFeatureSelector<ReportsState>(REPORTS_FEATURE_KEY);

export const selectActiveReportType = createSelector(selectReportsState, (s) => s.activeType);
export const selectReport = createSelector(selectReportsState, (s) => s.report);
export const selectReportQuery = createSelector(selectReportsState, (s) => s.query);
export const selectReportsLoading = createSelector(selectReportsState, (s) => s.loading);
export const selectReportsExporting = createSelector(selectReportsState, (s) => s.exporting);
export const selectReportsError = createSelector(selectReportsState, (s) => s.error);
export const selectReportsSuccessMessage = createSelector(selectReportsState, (s) => s.successMessage);
