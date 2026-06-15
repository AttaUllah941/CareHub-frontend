import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { DEFAULT_NOTIFICATION_LIST_QUERY } from '../../../core/models/notification.model';
import { NotificationApiService } from '../services/notification-api.service';
import { NotificationsActions } from './notifications.actions';
import { selectNotificationsQuery } from './notifications.selectors';

@Injectable()
export class NotificationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(NotificationApiService);
  private readonly store = inject(Store);

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      withLatestFrom(this.store.select(selectNotificationsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_NOTIFICATION_LIST_QUERY, ...current, ...query };
        const endpoint = merged.admin
          ? this.api.getAllNotifications(merged)
          : this.api.getMyNotifications(merged);
        return endpoint.pipe(
          map((res) =>
            NotificationsActions.loadNotificationsSuccess({
              notifications: res.data.notifications,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              NotificationsActions.loadNotificationsFailure({
                error: err.error?.message ?? 'Failed to load notifications',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadUnreadCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadUnreadCount),
      exhaustMap(() =>
        this.api.getUnreadCount().pipe(
          map((res) => NotificationsActions.loadUnreadCountSuccess({ count: res.data.count })),
          catchError(() => of(NotificationsActions.loadUnreadCountSuccess({ count: 0 }))),
        ),
      ),
    ),
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAsRead),
      exhaustMap(({ id }) =>
        this.api.markAsRead(id).pipe(
          map((res) => NotificationsActions.markAsReadSuccess({ notification: res.data.notification })),
          catchError((err) =>
            of(NotificationsActions.markAsReadFailure({ error: err.error?.message ?? 'Failed to mark as read' })),
          ),
        ),
      ),
    ),
  );

  markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAllAsRead),
      exhaustMap(() =>
        this.api.markAllAsRead().pipe(
          map((res) => NotificationsActions.markAllAsReadSuccess({ message: res.message ?? 'All marked as read' })),
          catchError((err) =>
            of(NotificationsActions.markAllAsReadFailure({ error: err.error?.message ?? 'Failed to mark all as read' })),
          ),
        ),
      ),
    ),
  );

  loadPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadPreferences),
      exhaustMap(() =>
        this.api.getPreferences().pipe(
          map((res) => NotificationsActions.loadPreferencesSuccess({ preferences: res.data.preferences })),
          catchError((err) =>
            of(NotificationsActions.loadPreferencesFailure({ error: err.error?.message ?? 'Failed to load preferences' })),
          ),
        ),
      ),
    ),
  );

  updatePreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.updatePreferences),
      exhaustMap(({ payload }) =>
        this.api.updatePreferences(payload).pipe(
          map((res) =>
            NotificationsActions.updatePreferencesSuccess({
              preferences: res.data.preferences,
              message: res.message ?? 'Preferences updated',
            }),
          ),
          catchError((err) =>
            of(
              NotificationsActions.updatePreferencesFailure({
                error: err.error?.message ?? 'Failed to update preferences',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
