import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { AdminDashboardStats } from '../../../core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getAdminStats(): Observable<ApiResponse<{ stats: AdminDashboardStats }>> {
    return this.http.get<ApiResponse<{ stats: AdminDashboardStats }>>(`${this.baseUrl}/admin`);
  }
}
