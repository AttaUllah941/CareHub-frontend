import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  Clinic,
  ClinicListQuery,
  CreateClinicRequest,
  PaginationMeta,
  UpdateClinicRequest,
} from '../../../core/models/clinic.model';

@Injectable({ providedIn: 'root' })
export class ClinicApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clinics`;

  getClinics(query: ClinicListQuery): Observable<ApiResponse<{ clinics: Clinic[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ clinics: Clinic[]; pagination: PaginationMeta }>>(this.baseUrl, {
      params: this.buildParams(query as unknown as Record<string, string | number>),
    });
  }

  getAllClinics(): Observable<ApiResponse<{ clinics: Clinic[] }>> {
    return this.http.get<ApiResponse<{ clinics: Clinic[] }>>(`${this.baseUrl}/all`);
  }

  getClinicById(id: string): Observable<ApiResponse<{ clinic: Clinic }>> {
    return this.http.get<ApiResponse<{ clinic: Clinic }>>(`${this.baseUrl}/${id}`);
  }

  getMyClinic(): Observable<ApiResponse<{ clinic: Clinic }>> {
    return this.http.get<ApiResponse<{ clinic: Clinic }>>(`${this.baseUrl}/me`);
  }

  createClinic(payload: CreateClinicRequest): Observable<ApiResponse<{ clinic: Clinic }>> {
    return this.http.post<ApiResponse<{ clinic: Clinic }>>(this.baseUrl, payload);
  }

  updateClinic(id: string, payload: UpdateClinicRequest): Observable<ApiResponse<{ clinic: Clinic }>> {
    return this.http.put<ApiResponse<{ clinic: Clinic }>>(`${this.baseUrl}/${id}`, payload);
  }

  updateMyClinic(payload: UpdateClinicRequest): Observable<ApiResponse<{ clinic: Clinic }>> {
    return this.http.put<ApiResponse<{ clinic: Clinic }>>(`${this.baseUrl}/me`, payload);
  }

  assignDoctors(id: string, doctorProfileIds: string[]): Observable<ApiResponse<{ clinic: Clinic }>> {
    return this.http.put<ApiResponse<{ clinic: Clinic }>>(`${this.baseUrl}/${id}/doctors`, { doctorProfileIds });
  }

  assignMyDoctors(doctorProfileIds: string[]): Observable<ApiResponse<{ clinic: Clinic }>> {
    return this.http.put<ApiResponse<{ clinic: Clinic }>>(`${this.baseUrl}/me/doctors`, { doctorProfileIds });
  }

  deleteClinic(id: string): Observable<ApiResponse<{ message: string }>> {
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
