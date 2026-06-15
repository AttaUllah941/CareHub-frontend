import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AnalyticsOverview, AnalyticsQuery, DEFAULT_ANALYTICS_QUERY } from '../../../core/models/analytics.model';

export const AnalyticsActions = createActionGroup({
  source: 'Analytics',
  events: {
    'Load Overview': props<{ query?: AnalyticsQuery }>(),
    'Load Overview Success': props<{ overview: AnalyticsOverview; query: AnalyticsQuery }>(),
    'Load Overview Failure': props<{ error: string }>(),
    'Set Query': props<{ query: AnalyticsQuery }>(),
    'Clear Error': emptyProps(),
  },
});

export { DEFAULT_ANALYTICS_QUERY };
