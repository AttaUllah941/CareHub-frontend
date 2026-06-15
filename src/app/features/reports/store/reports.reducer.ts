import { createReducer, on } from '@ngrx/store';
import { ReportsActions } from './reports.actions';
import { initialReportsState } from './reports.state';

export const reportsReducer = createReducer(
  initialReportsState,

  on(ReportsActions.setActiveType, (state, { reportType }) => ({
    ...state,
    activeType: reportType,
    report: null,
    error: null,
  })),
  on(ReportsActions.setQuery, (state, { query }) => ({
    ...state,
    query: { ...state.query, ...query },
  })),

  on(ReportsActions.loadReport, (state, { reportType, query }) => ({
    ...state,
    loading: true,
    error: null,
    successMessage: null,
    activeType: reportType ?? state.activeType,
    query: query ? { ...state.query, ...query } : state.query,
  })),
  on(ReportsActions.loadReportSuccess, (state, { report }) => ({
    ...state,
    report,
    loading: false,
  })),
  on(ReportsActions.loadReportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ReportsActions.exportReport, (state) => ({
    ...state,
    exporting: true,
    error: null,
  })),
  on(ReportsActions.exportReportSuccess, (state, { message }) => ({
    ...state,
    exporting: false,
    successMessage: message,
  })),
  on(ReportsActions.exportReportFailure, (state, { error }) => ({
    ...state,
    exporting: false,
    error,
  })),

  on(ReportsActions.clearReport, (state) => ({ ...state, report: null })),
  on(ReportsActions.clearError, (state) => ({ ...state, error: null })),
  on(ReportsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
