import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NotificationListComponent } from '../../components/notification-list/notification-list.component';
import { NotificationPreferencesFormComponent } from '../../components/notification-preferences-form/notification-preferences-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Notification, UpdateNotificationPreferencesRequest } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [
    FormsModule,
    NotificationListComponent,
    NotificationPreferencesFormComponent,
    AlertComponent,
    PaginationComponent,
  ],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.scss',
})
export class NotificationPageComponent implements OnInit {
  protected readonly notificationService = inject(NotificationService);
  readonly showPreferences = signal(false);
  readonly unreadOnly = signal(false);

  constructor() {
    effect(() => {
      if (this.notificationService.successMessage()) {
        this.notificationService.loadUnreadCount();
      }
    });
  }

  ngOnInit(): void {
    this.notificationService.clearError();
    this.notificationService.clearSuccessMessage();
    this.notificationService.loadNotifications();
    this.notificationService.loadUnreadCount();
    this.notificationService.loadPreferences();
  }

  onFilterChange(): void {
    this.notificationService.loadNotifications({
      unreadOnly: this.unreadOnly() ? 'true' : '',
      page: 1,
    });
  }

  onMarkRead(n: Notification): void {
    this.notificationService.markAsRead(n.id);
  }

  onMarkAllRead(): void {
    this.notificationService.markAllAsRead();
  }

  onPageChange(page: number): void {
    this.notificationService.loadNotifications({ page });
  }

  onSavePreferences(payload: UpdateNotificationPreferencesRequest): void {
    this.notificationService.updatePreferences(payload);
  }
}
