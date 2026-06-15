import { createReducer, on } from '@ngrx/store';
import { Notification } from '../../../core/models/notification.model';
import { NotificationsActions } from './notifications.actions';
import { initialNotificationsState } from './notifications.state';

const setSaving = (state: typeof initialNotificationsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialNotificationsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const notificationsReducer = createReducer(
  initialNotificationsState,

  on(NotificationsActions.loadNotifications, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...state.query, ...query },
  })),
  on(NotificationsActions.loadNotificationsSuccess, (state, { notifications, pagination, query }) => ({
    ...state,
    notifications,
    pagination,
    query,
    loading: false,
  })),
  on(NotificationsActions.loadNotificationsFailure, setFailure),

  on(NotificationsActions.loadUnreadCountSuccess, (state, { count }) => ({
    ...state,
    unreadCount: count,
  })),

  on(NotificationsActions.loadPreferences, (state) => ({ ...state, loading: true, error: null })),
  on(NotificationsActions.loadPreferencesSuccess, (state, { preferences }) => ({
    ...state,
    preferences,
    loading: false,
  })),
  on(NotificationsActions.loadPreferencesFailure, setFailure),

  on(NotificationsActions.markAsRead, NotificationsActions.markAllAsRead, NotificationsActions.updatePreferences, setSaving),
  on(NotificationsActions.markAsReadSuccess, (state, { notification }) => ({
    ...state,
    saving: false,
    notifications: state.notifications.map((n) => (n.id === notification.id ? notification : n)),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  on(NotificationsActions.markAllAsReadSuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    notifications: state.notifications.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
    unreadCount: 0,
  })),
  on(NotificationsActions.updatePreferencesSuccess, (state, { preferences, message }) => ({
    ...state,
    saving: false,
    preferences,
    successMessage: message,
  })),
  on(
    NotificationsActions.markAsReadFailure,
    NotificationsActions.markAllAsReadFailure,
    NotificationsActions.updatePreferencesFailure,
    setFailure,
  ),

  on(NotificationsActions.clearError, (state) => ({ ...state, error: null })),
  on(NotificationsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
