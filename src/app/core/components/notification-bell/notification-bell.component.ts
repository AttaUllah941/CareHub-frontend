import { DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { Component, computed, HostListener, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotification } from '../../models/notification.model';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserRole } from '../../models/auth.model';
import { ApiErrorService } from '../../services/api-error.service';
import { NotificationsApiService } from '../../services/notifications-api.service';
import {
  notificationTypeLabel,
  resolveNotificationRoute,
} from '../../utils/notification-nav.util';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    @if (authService.isAuthenticated() && canSeeBell()) {
      <div class="relative" data-notification-bell>
        <button
          type="button"
          (click)="togglePanel()"
          class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
          aria-label="Notifications"
          [attr.aria-expanded]="panelOpen()"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          @if (unreadCount() > 0) {
            <span
              class="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
            >
              {{ unreadCount() > 9 ? '9+' : unreadCount() }}
            </span>
          }
        </button>

        @if (panelOpen()) {
          <div
            class="nav-dropdown right-0 mt-2 w-[min(22rem,calc(100vw-1.5rem))] max-h-[28rem] overflow-hidden flex flex-col shadow-xl"
            role="dialog"
            aria-label="Notifications panel"
          >
            <div class="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white px-4 py-3">
              <div>
                <p class="text-sm font-bold text-gray-900">Notifications</p>
                <p class="text-[11px] text-gray-500">
                  @if (unreadCount() > 0) {
                    {{ unreadCount() }} unread
                  } @else {
                    You're all caught up
                  }
                </p>
              </div>
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

            <div class="overflow-y-auto flex-1">
              @if (loading()) {
                <p class="px-4 py-8 text-sm text-gray-500 text-center">Loading…</p>
              } @else if (error()) {
                <p class="px-4 py-8 text-sm text-red-600 text-center">{{ error() }}</p>
              } @else if (notifications().length) {
                <ul class="divide-y divide-gray-100">
                  @for (n of notifications(); track n.id) {
                    <li>
                      <button
                        type="button"
                        (click)="openNotification(n)"
                        class="w-full text-left px-4 py-3.5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:bg-brand-50"
                        [class.bg-brand-50/70]="!n.isRead"
                      >
                        <div class="flex items-start gap-3">
                          <span
                            class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-wide"
                            [ngClass]="typeBadgeClass(n.type)"
                          >
                            {{ typeShort(n.type) }}
                          </span>
                          <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-2">
                              <p class="text-sm font-semibold text-gray-900 leading-snug">{{ n.title }}</p>
                              @if (!n.isRead) {
                                <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true"></span>
                              }
                            </div>
                            <p class="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{{ n.body }}</p>
                            <div class="mt-1.5 flex items-center gap-2 text-[10px] text-gray-400">
                              <span class="font-medium text-gray-500">{{ labelFor(n.type) }}</span>
                              @if (n.createdAt) {
                                <span>·</span>
                                <span>{{ n.createdAt | date: 'mediumDate' }} {{ n.createdAt | date: 'shortTime' }}</span>
                              }
                            </div>
                            <p class="mt-1.5 text-[11px] font-semibold text-brand-600">View details →</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  }
                </ul>
              } @else {
                <div class="px-4 py-10 text-center">
                  <p class="text-sm font-medium text-gray-700">No notifications yet</p>
                  <p class="mt-1 text-xs text-gray-500">Updates about appointments and applications will show here.</p>
                </div>
              }
            </div>
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
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  /** Patients, doctors, and admins all see the inbox. */
  readonly canSeeBell = computed(() =>
    this.authService.hasRole(
      UserRole.PATIENT,
      UserRole.DOCTOR,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ),
  );

  readonly notifications = signal<AppNotification[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly panelOpen = signal(false);

  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.panelOpen()) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-notification-bell]')) return;
    this.panelOpen.set(false);
  }

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

  openNotification(notification: AppNotification): void {
    this.markRead(notification);

    const role = this.authService.user()?.role;
    const route = resolveNotificationRoute(notification, role);
    this.panelOpen.set(false);

    if (route) {
      void this.router.navigateByUrl(route);
    }
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

  labelFor(type: string): string {
    return notificationTypeLabel(type);
  }

  typeShort(type: string): string {
    switch (type) {
      case 'appointment_booked':
        return 'New';
      case 'appointment_confirmed':
        return 'OK';
      case 'appointment_cancelled':
        return 'CXL';
      case 'appointment_rejected':
        return 'No';
      case 'application_approved':
        return 'Yes';
      case 'application_rejected':
        return 'No';
      default:
        return 'Info';
    }
  }

  typeBadgeClass(type: string): string {
    switch (type) {
      case 'appointment_confirmed':
      case 'application_approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'appointment_cancelled':
      case 'appointment_rejected':
      case 'application_rejected':
        return 'bg-red-100 text-red-700';
      case 'appointment_booked':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
