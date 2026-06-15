import { AnalyticsOverview, AnalyticsQuery } from '../../../core/models/analytics.model';
import { DEFAULT_ANALYTICS_QUERY } from './analytics.actions';

export const ANALYTICS_FEATURE_KEY = 'analytics';

export interface AnalyticsState {
  overview: AnalyticsOverview | null;
  query: AnalyticsQuery;
  loading: boolean;
  error: string | null;
}

export const initialState: AnalyticsState = {
  overview: null,
  query: DEFAULT_ANALYTICS_QUERY,
  loading: false,
  error: null,
};
