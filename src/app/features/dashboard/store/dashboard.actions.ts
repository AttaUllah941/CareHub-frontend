import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AdminDashboardStats } from '../../../core/models/dashboard.model';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Load Admin Stats': emptyProps(),
    'Load Admin Stats Success': props<{ stats: AdminDashboardStats }>(),
    'Load Admin Stats Failure': props<{ error: string }>(),
    'Clear Error': emptyProps(),
  },
});
