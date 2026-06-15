import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  CreateDoctorRequest,
  Doctor,
  DoctorListQuery,
  DoctorSearchQuery,
  DoctorSearchResult,
  PaginationMeta,
  UpdateDoctorRequest,
  UpdateMyDoctorProfileRequest,
  VerifyDoctorRequest,
} from '../../../core/models/doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/doctors`;

  getDoctors(query: DoctorListQuery): Observable<ApiResponse<{ doctors: Doctor[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ doctors: Doctor[]; pagination: PaginationMeta }>>(this.baseUrl, {
      params: this.buildParams(query as unknown as Record<string, string | number>),
    });
  }

  searchDoctors(
    query: DoctorSearchQuery,
  ): Observable<ApiResponse<{ doctors: DoctorSearchResult[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ doctors: DoctorSearchResult[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/search`,
      { params: this.buildParams(query as unknown as Record<string, string | number>) },
    );
  }

  getDoctorById(id: string): Observable<ApiResponse<{ doctor: Doctor }>> {
    return this.http.get<ApiResponse<{ doctor: Doctor }>>(`${this.baseUrl}/${id}`);
  }

  getMyProfile(): Observable<ApiResponse<{ doctor: Doctor }>> {
    return this.http.get<ApiResponse<{ doctor: Doctor }>>(`${this.baseUrl}/me`);
  }

  createDoctor(payload: CreateDoctorRequest): Observable<ApiResponse<{ doctor: Doctor }>> {
    return this.http.post<ApiResponse<{ doctor: Doctor }>>(this.baseUrl, payload);
  }

  createMyProfile(payload: UpdateMyDoctorProfileRequest): Observable<ApiResponse<{ doctor: Doctor }>> {
    return this.http.post<ApiResponse<{ doctor: Doctor }>>(`${this.baseUrl}/me`, payload);
  }

  updateDoctor(id: string, payload: UpdateDoctorRequest): Observable<ApiResponse<{ doctor: Doctor }>> {
    return this.http.put<ApiResponse<{ doctor: Doctor }>>(`${this.baseUrl}/${id}`, payload);
  }

  updateMyProfile(payload: UpdateMyDoctorProfileRequest): Observable<ApiResponse<{ doctor: Doctor }>> {
    return this.http.put<ApiResponse<{ doctor: Doctor }>>(`${this.baseUrl}/me`, payload);
  }

  verifyDoctor(id: string, payload: VerifyDoctorRequest): Observable<ApiResponse<{ doctor: Doctor }>> {
    return this.http.patch<ApiResponse<{ doctor: Doctor }>>(`${this.baseUrl}/${id}/verify`, payload);
  }

  deleteDoctor(id: string): Observable<ApiResponse<{ message: string }>> {
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
