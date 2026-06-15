import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  Notification,
  NotificationListQuery,
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from '../../../core/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  getMyNotifications(
    query: NotificationListQuery,
  ): Observable<ApiResponse<{ notifications: Notification[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ notifications: Notification[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/me`,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.baseUrl}/me/unread-count`);
  }

  markAsRead(id: string): Observable<ApiResponse<{ notification: Notification }>> {
    return this.http.patch<ApiResponse<{ notification: Notification }>>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<ApiResponse<{ message: string }>> {
    return this.http.patch<ApiResponse<{ message: string }>>(`${this.baseUrl}/me/read-all`, {});
  }

  getPreferences(): Observable<ApiResponse<{ preferences: NotificationPreferences }>> {
    return this.http.get<ApiResponse<{ preferences: NotificationPreferences }>>(`${this.baseUrl}/preferences`);
  }

  updatePreferences(
    payload: UpdateNotificationPreferencesRequest,
  ): Observable<ApiResponse<{ preferences: NotificationPreferences }>> {
    return this.http.put<ApiResponse<{ preferences: NotificationPreferences }>>(
      `${this.baseUrl}/preferences`,
      payload,
    );
  }

  getAllNotifications(
    query: NotificationListQuery,
  ): Observable<ApiResponse<{ notifications: Notification[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ notifications: Notification[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  private buildParams(query: Record<string, string | number | boolean>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (key === 'admin') return;
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
