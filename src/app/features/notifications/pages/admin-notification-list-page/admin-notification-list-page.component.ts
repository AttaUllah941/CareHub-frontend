import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NotificationListComponent } from '../../components/notification-list/notification-list.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { NOTIFICATION_TYPE_LABELS } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-admin-notification-list-page',
  standalone: true,
  imports: [FormsModule, NotificationListComponent, AlertComponent, PaginationComponent],
  templateUrl: './admin-notification-list-page.component.html',
  styleUrl: './admin-notification-list-page.component.scss',
})
export class AdminNotificationListPageComponent implements OnInit {
  protected readonly notificationService = inject(NotificationService);
  readonly typeOptions = Object.entries(NOTIFICATION_TYPE_LABELS);
  search = '';
  typeFilter = '';

  ngOnInit(): void {
    this.notificationService.clearError();
    this.notificationService.loadNotifications({ admin: true });
  }

  onSearch(): void {
    this.notificationService.loadNotifications({
      search: this.search,
      type: this.typeFilter,
      admin: true,
      page: 1,
    });
  }

  onPageChange(page: number): void {
    this.notificationService.loadNotifications({ page, admin: true });
  }
}
