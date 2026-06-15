import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  CreatePatientRequest,
  Patient,
  PatientListQuery,
  PaginationMeta,
  UpdateMyPatientProfileRequest,
  UpdatePatientRequest,
} from '../../../core/models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/patients`;

  getPatients(query: PatientListQuery): Observable<ApiResponse<{ patients: Patient[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ patients: Patient[]; pagination: PaginationMeta }>>(this.baseUrl, {
      params: this.buildParams(query as unknown as Record<string, string | number>),
    });
  }

  getPatientById(id: string): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.get<ApiResponse<{ patient: Patient }>>(`${this.baseUrl}/${id}`);
  }

  getMyProfile(): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.get<ApiResponse<{ patient: Patient }>>(`${this.baseUrl}/me`);
  }

  createPatient(payload: CreatePatientRequest): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.post<ApiResponse<{ patient: Patient }>>(this.baseUrl, payload);
  }

  createMyProfile(payload: UpdateMyPatientProfileRequest): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.post<ApiResponse<{ patient: Patient }>>(`${this.baseUrl}/me`, payload);
  }

  updatePatient(id: string, payload: UpdatePatientRequest): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.put<ApiResponse<{ patient: Patient }>>(`${this.baseUrl}/${id}`, payload);
  }

  updateMyProfile(payload: UpdateMyPatientProfileRequest): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.put<ApiResponse<{ patient: Patient }>>(`${this.baseUrl}/me`, payload);
  }

  deletePatient(id: string): Observable<ApiResponse<{ message: string }>> {
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
