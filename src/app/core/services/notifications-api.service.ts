import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { ApiResponse } from '../models/api.model';
import {
  AppNotification,
  NotificationListQuery,
  NotificationListResponse,
} from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly api = inject(ApiClientService);

  listMine(query: NotificationListQuery = {}): Observable<ApiResponse<NotificationListResponse>> {
    const params: Record<string, string | number | undefined> = {
      page: query.page,
      limit: query.limit,
    };

    if (query.unreadOnly !== undefined) {
      params['unreadOnly'] = query.unreadOnly === true || query.unreadOnly === 'true' ? 'true' : 'false';
    }

    return this.api.get<NotificationListResponse>('/notifications/me', { params });
  }

  markRead(id: string): Observable<ApiResponse<{ notification: AppNotification }>> {
    return this.api.patch<{ notification: AppNotification }>(`/notifications/${id}/read`, {});
  }
}
