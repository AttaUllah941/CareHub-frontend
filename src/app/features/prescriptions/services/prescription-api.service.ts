import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  CreatePrescriptionRequest,
  Prescription,
  PrescriptionListQuery,
  UpdatePrescriptionRequest,
} from '../../../core/models/prescription.model';

@Injectable({ providedIn: 'root' })
export class PrescriptionApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/prescriptions`;

  getMyPrescriptions(): Observable<ApiResponse<{ prescriptions: Prescription[] }>> {
    return this.http.get<ApiResponse<{ prescriptions: Prescription[] }>>(`${this.baseUrl}/me`);
  }

  getDoctorPrescriptions(): Observable<ApiResponse<{ prescriptions: Prescription[] }>> {
    return this.http.get<ApiResponse<{ prescriptions: Prescription[] }>>(`${this.baseUrl}/doctor`);
  }

  getPrescriptions(
    query: PrescriptionListQuery,
  ): Observable<ApiResponse<{ prescriptions: Prescription[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ prescriptions: Prescription[]; pagination: PaginationMeta }>>(
      this.baseUrl,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getByConsultationId(consultationId: string): Observable<ApiResponse<{ prescription: Prescription }>> {
    return this.http.get<ApiResponse<{ prescription: Prescription }>>(
      `${this.baseUrl}/consultation/${consultationId}`,
    );
  }

  getPrescriptionById(id: string): Observable<ApiResponse<{ prescription: Prescription }>> {
    return this.http.get<ApiResponse<{ prescription: Prescription }>>(`${this.baseUrl}/${id}`);
  }

  createForConsultation(
    consultationId: string,
    payload: CreatePrescriptionRequest,
  ): Observable<ApiResponse<{ prescription: Prescription }>> {
    return this.http.post<ApiResponse<{ prescription: Prescription }>>(
      `${this.baseUrl}/consultation/${consultationId}`,
      payload,
    );
  }

  updatePrescription(
    id: string,
    payload: UpdatePrescriptionRequest,
  ): Observable<ApiResponse<{ prescription: Prescription }>> {
    return this.http.put<ApiResponse<{ prescription: Prescription }>>(`${this.baseUrl}/${id}`, payload);
  }

  deletePrescription(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}`);
  }

  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
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
