import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  Appointment,
  AppointmentListQuery,
  AvailableSlotsResponse,
  BookAppointmentRequest,
  CancelAppointmentRequest,
  PaginationMeta,
  RecurringSlotsResponse,
  RescheduleAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateAppointmentStatusRequest,
} from '../../../core/models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/appointments`;

  getAvailableSlots(
    doctorProfileId: string,
    date: string,
    clinicId?: string,
  ): Observable<ApiResponse<AvailableSlotsResponse>> {
    let params = new HttpParams().set('doctorProfileId', doctorProfileId).set('date', date);
    if (clinicId) params = params.set('clinicId', clinicId);
    return this.http.get<ApiResponse<AvailableSlotsResponse>>(`${this.baseUrl}/available-slots`, { params });
  }

  getRecurringSlots(
    doctorProfileId: string,
    fromDate: string,
    toDate: string,
    options?: { clinicId?: string; maxDays?: number },
  ): Observable<ApiResponse<RecurringSlotsResponse>> {
    let params = new HttpParams()
      .set('doctorProfileId', doctorProfileId)
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    if (options?.clinicId) params = params.set('clinicId', options.clinicId);
    if (options?.maxDays) params = params.set('maxDays', String(options.maxDays));
    return this.http.get<ApiResponse<RecurringSlotsResponse>>(`${this.baseUrl}/available-slots/range`, { params });
  }

  getMyAppointments(status?: string): Observable<ApiResponse<{ appointments: Appointment[] }>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<{ appointments: Appointment[] }>>(`${this.baseUrl}/me`, { params });
  }

  getDoctorAppointments(status?: string): Observable<ApiResponse<{ appointments: Appointment[] }>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<{ appointments: Appointment[] }>>(`${this.baseUrl}/doctor`, { params });
  }

  getAppointments(
    query: AppointmentListQuery,
  ): Observable<ApiResponse<{ appointments: Appointment[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ appointments: Appointment[]; pagination: PaginationMeta }>>(this.baseUrl, {
      params: this.buildParams(query as unknown as Record<string, string | number>),
    });
  }

  getAppointmentById(id: string): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.get<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/me/${id}`);
  }

  bookAppointment(payload: BookAppointmentRequest): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.post<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/me`, payload);
  }

  updateMyAppointment(
    id: string,
    payload: UpdateAppointmentRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.put<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/me/${id}`, payload);
  }

  cancelMyAppointment(
    id: string,
    payload: CancelAppointmentRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/me/${id}/cancel`, payload);
  }

  rescheduleMyAppointment(
    id: string,
    payload: RescheduleAppointmentRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(
      `${this.baseUrl}/me/${id}/reschedule`,
      payload,
    );
  }

  updateDoctorStatus(
    id: string,
    payload: UpdateAppointmentStatusRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(
      `${this.baseUrl}/doctor/${id}/status`,
      payload,
    );
  }

  adminUpdateAppointment(
    id: string,
    payload: UpdateAppointmentRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.put<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/${id}`, payload);
  }

  adminCancelAppointment(
    id: string,
    payload: CancelAppointmentRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/${id}/cancel`, payload);
  }

  adminRescheduleAppointment(
    id: string,
    payload: RescheduleAppointmentRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/${id}/reschedule`, payload);
  }

  adminUpdateStatus(
    id: string,
    payload: UpdateAppointmentStatusRequest,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(`${this.baseUrl}/${id}/status`, payload);
  }

  private buildParams(query: Record<string, string | number>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
