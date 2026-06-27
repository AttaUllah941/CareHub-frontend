import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import {
  Appointment,
  AppointmentListQuery,
  AppointmentListResponse,
  CreateAppointmentRequest,
} from '../../../core/models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentsApiService {
  private readonly api = inject(ApiClientService);

  create(
    payload: CreateAppointmentRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.api.post<{ appointment: Appointment }>('/appointments', payload);
  }

  listMine(query: AppointmentListQuery = {}): Observable<ApiResponse<AppointmentListResponse>> {
    return this.api.get<AppointmentListResponse>('/appointments/me', {
      params: query as Record<string, string | number | undefined>,
    });
  }

  cancel(id: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.api.patch<{ appointment: Appointment }>(`/appointments/${id}/cancel`, {});
  }

  listDoctor(query: AppointmentListQuery = {}): Observable<ApiResponse<AppointmentListResponse>> {
    return this.api.get<AppointmentListResponse>('/doctor/appointments', {
      params: query as Record<string, string | number | undefined>,
    });
  }

  confirm(id: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.api.patch<{ appointment: Appointment }>(`/doctor/appointments/${id}/confirm`, {});
  }

  complete(id: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.api.patch<{ appointment: Appointment }>(`/doctor/appointments/${id}/complete`, {});
  }

  reject(id: string, rejectionReason?: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.api.patch<{ appointment: Appointment }>(`/doctor/appointments/${id}/reject`, {
      rejectionReason,
    });
  }
}
