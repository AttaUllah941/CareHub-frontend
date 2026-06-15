import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Notification,
  NotificationListQuery,
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from '../../../core/models/notification.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const NotificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    'Load Notifications': props<{ query?: Partial<NotificationListQuery> }>(),
    'Load Notifications Success': props<{
      notifications: Notification[];
      pagination: PaginationMeta;
      query: NotificationListQuery;
    }>(),
    'Load Notifications Failure': props<{ error: string }>(),

    'Load Unread Count': emptyProps(),
    'Load Unread Count Success': props<{ count: number }>(),
    'Load Unread Count Failure': props<{ error: string }>(),

    'Mark As Read': props<{ id: string }>(),
    'Mark As Read Success': props<{ notification: Notification }>(),
    'Mark As Read Failure': props<{ error: string }>(),

    'Mark All As Read': emptyProps(),
    'Mark All As Read Success': props<{ message: string }>(),
    'Mark All As Read Failure': props<{ error: string }>(),

    'Load Preferences': emptyProps(),
    'Load Preferences Success': props<{ preferences: NotificationPreferences }>(),
    'Load Preferences Failure': props<{ error: string }>(),

    'Update Preferences': props<{ payload: UpdateNotificationPreferencesRequest }>(),
    'Update Preferences Success': props<{ preferences: NotificationPreferences; message: string }>(),
    'Update Preferences Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
