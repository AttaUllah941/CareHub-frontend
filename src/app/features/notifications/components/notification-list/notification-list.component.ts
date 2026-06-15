import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Notification,
  channelLabel,
  formatNotificationDate,
  notificationTypeLabel,
} from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent {
  readonly notifications = input<Notification[]>([]);
  readonly loading = input(false);
  readonly showDelivery = input(false);

  readonly markRead = output<Notification>();

  readonly formatDate = formatNotificationDate;
  readonly typeLabel = notificationTypeLabel;
  readonly channelLabel = channelLabel;
}
