import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  CreateLabBookingRequest,
  CreateLabRequest,
  CreateLabTestRequest,
  Lab,
  LabBooking,
  LabListQuery,
  LabReport,
  LabTest,
} from '../../../core/models/lab.model';

@Injectable({ providedIn: 'root' })
export class LabApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/lab`;

  getLabs(query?: Partial<LabListQuery>): Observable<ApiResponse<{ labs: Lab[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ labs: Lab[]; pagination: PaginationMeta }>>(`${this.baseUrl}/labs`, {
      params: this.buildParams(query ?? {}),
    });
  }

  createLab(payload: CreateLabRequest): Observable<ApiResponse<{ lab: Lab }>> {
    return this.http.post<ApiResponse<{ lab: Lab }>>(`${this.baseUrl}/labs`, payload);
  }

  getTests(query?: Record<string, string | number | boolean>): Observable<
    ApiResponse<{ tests: LabTest[]; pagination: PaginationMeta }>
  > {
    return this.http.get<ApiResponse<{ tests: LabTest[]; pagination: PaginationMeta }>>(`${this.baseUrl}/tests`, {
      params: this.buildParams(query ?? {}),
    });
  }

  createTest(payload: CreateLabTestRequest): Observable<ApiResponse<{ test: LabTest }>> {
    return this.http.post<ApiResponse<{ test: LabTest }>>(`${this.baseUrl}/tests`, payload);
  }

  getBookings(query?: Record<string, string | number>): Observable<
    ApiResponse<{ bookings: LabBooking[]; pagination: PaginationMeta }>
  > {
    return this.http.get<ApiResponse<{ bookings: LabBooking[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/bookings`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  getMyBookings(): Observable<ApiResponse<{ bookings: LabBooking[] }>> {
    return this.http.get<ApiResponse<{ bookings: LabBooking[] }>>(`${this.baseUrl}/bookings/me`);
  }

  createBooking(payload: CreateLabBookingRequest): Observable<ApiResponse<{ booking: LabBooking }>> {
    return this.http.post<ApiResponse<{ booking: LabBooking }>>(`${this.baseUrl}/bookings`, payload);
  }

  updateBookingStatus(id: string, payload: { status: string; notes?: string }): Observable<ApiResponse<{ booking: LabBooking }>> {
    return this.http.patch<ApiResponse<{ booking: LabBooking }>>(`${this.baseUrl}/bookings/${id}/status`, payload);
  }

  getMyReports(): Observable<ApiResponse<{ reports: LabReport[] }>> {
    return this.http.get<ApiResponse<{ reports: LabReport[] }>>(`${this.baseUrl}/reports/me`);
  }

  getReports(query?: Record<string, string | number>): Observable<
    ApiResponse<{ reports: LabReport[]; pagination: PaginationMeta }>
  > {
    return this.http.get<ApiResponse<{ reports: LabReport[]; pagination: PaginationMeta }>>(
      `${this.baseUrl}/reports`,
      { params: this.buildParams(query ?? {}) },
    );
  }

  uploadReport(formData: FormData): Observable<ApiResponse<{ report: LabReport }>> {
    return this.http.post<ApiResponse<{ report: LabReport }>>(`${this.baseUrl}/reports`, formData);
  }

  downloadReport(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/${id}/download`, { responseType: 'blob' });
  }

  private buildParams(query: Record<string, string | number | boolean | undefined>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) params = params.set(key, String(value));
    });
    return params;
  }
}
