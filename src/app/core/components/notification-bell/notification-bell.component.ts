import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AppNotification } from '../../models/notification.model';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ApiErrorService } from '../../services/api-error.service';
import { NotificationsApiService } from '../../services/notifications-api.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (authService.isAuthenticated()) {
      <div class="relative">
        <button
          type="button"
          (click)="togglePanel()"
          class="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand-600 transition-colors"
          aria-label="Notifications"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          @if (unreadCount() > 0) {
            <span
              class="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
            >
              {{ unreadCount() > 9 ? '9+' : unreadCount() }}
            </span>
          }
        </button>

        @if (panelOpen()) {
          <div
            class="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl z-50"
          >
            <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <p class="text-sm font-bold text-gray-900">Notifications</p>
              @if (unreadCount() > 0) {
                <button
                  type="button"
                  (click)="markAllRead()"
                  class="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Mark all read
                </button>
              }
            </div>

            @if (loading()) {
              <p class="px-4 py-6 text-sm text-gray-500 text-center">Loading…</p>
            } @else if (error()) {
              <p class="px-4 py-6 text-sm text-red-600 text-center">{{ error() }}</p>
            } @else if (notifications().length) {
              <ul class="divide-y divide-gray-100">
                @for (n of notifications(); track n.id) {
                  <li>
                    <button
                      type="button"
                      (click)="markRead(n)"
                      class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                      [class.bg-brand-50]="!n.isRead"
                    >
                      <p class="text-sm font-semibold text-gray-900">{{ n.title }}</p>
                      <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">{{ n.body }}</p>
                      @if (n.createdAt) {
                        <p class="text-[10px] text-gray-400 mt-1">{{ n.createdAt | date: 'medium' }}</p>
                      }
                    </button>
                  </li>
                }
              </ul>
            } @else {
              <p class="px-4 py-8 text-sm text-gray-500 text-center">No notifications yet.</p>
            }
          </div>
        }
      </div>
    }
  `,
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  protected readonly authService = inject(AuthService);
  private readonly notificationsApi = inject(NotificationsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  readonly notifications = signal<AppNotification[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly panelOpen = signal(false);

  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  ngOnInit(): void {
    if (this.isBrowser && this.authService.isAuthenticated()) {
      this.loadNotifications();
      this.startPolling();
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private startPolling(): void {
    if (!this.isBrowser || this.pollTimer) return;

    this.pollTimer = setInterval(() => {
      if (this.authService.isAuthenticated()) {
        this.loadNotifications(true);
      }
    }, 30000);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  togglePanel(): void {
    const next = !this.panelOpen();
    this.panelOpen.set(next);
    if (next) {
      this.loadNotifications();
    }
  }

  loadNotifications(silent = false): void {
    if (!this.isBrowser) return;

    if (!silent) {
      this.loading.set(true);
      this.error.set(null);
    }

    this.notificationsApi.listMine({ page: 1, limit: 20 }).subscribe({
      next: (res) => {
        this.notifications.set(res.data.notifications);
        if (!silent) {
          this.loading.set(false);
        }
      },
      error: (err) => {
        if (!silent) {
          this.error.set(this.apiErrorService.getMessage(err));
          this.loading.set(false);
        }
      },
    });
  }

  markRead(notification: AppNotification): void {
    if (notification.isRead) return;

    this.notificationsApi.markRead(notification.id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
        );
      },
    });
  }

  markAllRead(): void {
    const unread = this.notifications().filter((n) => !n.isRead);
    for (const n of unread) {
      this.markRead(n);
    }
  }
}
