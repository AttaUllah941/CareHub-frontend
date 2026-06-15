import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NOTIFICATIONS_FEATURE_KEY, NotificationsState } from './notifications.state';

export const selectNotificationsState = createFeatureSelector<NotificationsState>(NOTIFICATIONS_FEATURE_KEY);

export const selectNotifications = createSelector(selectNotificationsState, (s) => s.notifications);
export const selectNotificationPreferences = createSelector(selectNotificationsState, (s) => s.preferences);
export const selectUnreadCount = createSelector(selectNotificationsState, (s) => s.unreadCount);
export const selectNotificationsPagination = createSelector(selectNotificationsState, (s) => s.pagination);
export const selectNotificationsQuery = createSelector(selectNotificationsState, (s) => s.query);
export const selectNotificationsLoading = createSelector(selectNotificationsState, (s) => s.loading);
export const selectNotificationsSaving = createSelector(selectNotificationsState, (s) => s.saving);
export const selectNotificationsError = createSelector(selectNotificationsState, (s) => s.error);
export const selectNotificationsSuccessMessage = createSelector(selectNotificationsState, (s) => s.successMessage);
