import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import {
  AdminDashboardStats,
  AdminUser,
  AdminUserListQuery,
  PaginatedUsers,
} from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly api = inject(ApiClientService);

  getDashboardStats(): Observable<ApiResponse<AdminDashboardStats>> {
    return this.api.get<AdminDashboardStats>('/admin/dashboard/stats');
  }

  listUsers(query: AdminUserListQuery = {}): Observable<ApiResponse<PaginatedUsers>> {
    return this.api.get<PaginatedUsers>('/admin/users', {
      params: query as Record<string, string | number | undefined>,
    });
  }

  updateUserStatus(id: string, isActive: boolean): Observable<ApiResponse<{ user: AdminUser }>> {
    return this.api.patch<{ user: AdminUser }>(`/admin/users/${id}/status`, { isActive });
  }
}
