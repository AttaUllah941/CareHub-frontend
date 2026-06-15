import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  Consultation,
  ConsultationListQuery,
  CreateConsultationRequest,
  UpdateConsultationRequest,
} from '../../../core/models/consultation.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

@Injectable({ providedIn: 'root' })
export class ConsultationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/consultations`;

  getMyConsultations(): Observable<ApiResponse<{ consultations: Consultation[] }>> {
    return this.http.get<ApiResponse<{ consultations: Consultation[] }>>(`${this.baseUrl}/me`);
  }

  getDoctorConsultations(): Observable<ApiResponse<{ consultations: Consultation[] }>> {
    return this.http.get<ApiResponse<{ consultations: Consultation[] }>>(`${this.baseUrl}/doctor`);
  }

  getConsultations(
    query: ConsultationListQuery,
  ): Observable<ApiResponse<{ consultations: Consultation[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ consultations: Consultation[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getByAppointmentId(appointmentId: string): Observable<ApiResponse<{ consultation: Consultation }>> {
    return this.http.get<ApiResponse<{ consultation: Consultation }>>(
      `${this.baseUrl}/appointment/${appointmentId}`,
    );
  }

  getConsultationById(id: string): Observable<ApiResponse<{ consultation: Consultation }>> {
    return this.http.get<ApiResponse<{ consultation: Consultation }>>(`${this.baseUrl}/${id}`);
  }

  createForAppointment(
    appointmentId: string,
    payload: CreateConsultationRequest,
  ): Observable<ApiResponse<{ consultation: Consultation }>> {
    return this.http.post<ApiResponse<{ consultation: Consultation }>>(
      `${this.baseUrl}/appointment/${appointmentId}`,
      payload,
    );
  }

  updateConsultation(
    id: string,
    payload: UpdateConsultationRequest,
  ): Observable<ApiResponse<{ consultation: Consultation }>> {
    return this.http.put<ApiResponse<{ consultation: Consultation }>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteConsultation(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}`);
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
