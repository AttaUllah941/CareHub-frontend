import { Notification, NotificationListQuery, NotificationPreferences } from '../../../core/models/notification.model';

export interface NotificationsState {
  notifications: Notification[];
  preferences: NotificationPreferences | null;
  unreadCount: number;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: NotificationListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const NOTIFICATIONS_FEATURE_KEY = 'notifications';

export const initialNotificationsState: NotificationsState = {
  notifications: [],
  preferences: null,
  unreadCount: 0,
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  query: {
    page: 1,
    limit: 20,
    unreadOnly: '',
    userId: '',
    type: '',
    search: '',
  },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
