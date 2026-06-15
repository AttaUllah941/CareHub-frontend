import { createReducer, on } from '@ngrx/store';
import { AnalyticsActions } from './analytics.actions';
import { initialState } from './analytics.state';

export const analyticsReducer = createReducer(
  initialState,
  on(AnalyticsActions.loadOverview, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...state.query, ...query },
  })),
  on(AnalyticsActions.loadOverviewSuccess, (state, { overview, query }) => ({
    ...state,
    loading: false,
    overview,
    query,
  })),
  on(AnalyticsActions.loadOverviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AnalyticsActions.setQuery, (state, { query }) => ({
    ...state,
    query: { ...state.query, ...query },
  })),
  on(AnalyticsActions.clearError, (state) => ({ ...state, error: null })),
);
