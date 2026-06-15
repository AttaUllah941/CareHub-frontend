import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationListQuery, UpdateNotificationPreferencesRequest } from '../../../core/models/notification.model';
import { NotificationsActions } from '../store/notifications.actions';
import {
  selectNotificationPreferences,
  selectNotifications,
  selectNotificationsError,
  selectNotificationsLoading,
  selectNotificationsPagination,
  selectNotificationsQuery,
  selectNotificationsSaving,
  selectNotificationsSuccessMessage,
  selectUnreadCount,
} from '../store/notifications.selectors';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly store = inject(Store);

  readonly notifications = this.store.selectSignal(selectNotifications);
  readonly preferences = this.store.selectSignal(selectNotificationPreferences);
  readonly unreadCount = this.store.selectSignal(selectUnreadCount);
  readonly pagination = this.store.selectSignal(selectNotificationsPagination);
  readonly query = this.store.selectSignal(selectNotificationsQuery);
  readonly loading = this.store.selectSignal(selectNotificationsLoading);
  readonly saving = this.store.selectSignal(selectNotificationsSaving);
  readonly error = this.store.selectSignal(selectNotificationsError);
  readonly successMessage = this.store.selectSignal(selectNotificationsSuccessMessage);

  loadNotifications(query?: Partial<NotificationListQuery>): void {
    this.store.dispatch(NotificationsActions.loadNotifications({ query }));
  }

  loadUnreadCount(): void {
    this.store.dispatch(NotificationsActions.loadUnreadCount());
  }

  markAsRead(id: string): void {
    this.store.dispatch(NotificationsActions.markAsRead({ id }));
  }

  markAllAsRead(): void {
    this.store.dispatch(NotificationsActions.markAllAsRead());
  }

  loadPreferences(): void {
    this.store.dispatch(NotificationsActions.loadPreferences());
  }

  updatePreferences(payload: UpdateNotificationPreferencesRequest): void {
    this.store.dispatch(NotificationsActions.updatePreferences({ payload }));
  }

  clearError(): void {
    this.store.dispatch(NotificationsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(NotificationsActions.clearSuccessMessage());
  }
}
