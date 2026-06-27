import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import {
  DoctorApplication,
  DoctorApplicationListQuery,
  PaginatedDoctorApplications,
} from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class DoctorApplicationsAdminApiService {
  private readonly api = inject(ApiClientService);

  list(query: DoctorApplicationListQuery = {}): Observable<ApiResponse<PaginatedDoctorApplications>> {
    return this.api.get<PaginatedDoctorApplications>('/admin/doctor-applications', {
      params: query as Record<string, string | number | undefined>,
    });
  }

  getById(id: string): Observable<ApiResponse<{ application: DoctorApplication }>> {
    return this.api.get<{ application: DoctorApplication }>(`/admin/doctor-applications/${id}`);
  }

  approve(id: string): Observable<ApiResponse<{ application: DoctorApplication }>> {
    return this.api.patch<{ application: DoctorApplication }>(
      `/admin/doctor-applications/${id}/approve`,
      {},
    );
  }

  reject(
    id: string,
    rejectionReason: string,
  ): Observable<ApiResponse<{ application: DoctorApplication }>> {
    return this.api.patch<{ application: DoctorApplication }>(
      `/admin/doctor-applications/${id}/reject`,
      { rejectionReason },
    );
  }
}
