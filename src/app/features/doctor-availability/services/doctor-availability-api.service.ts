import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import {
  DoctorAvailability,
  SlotsResponse,
  UpdateAvailabilityRequest,
} from '../../../core/models/doctor-availability.model';

@Injectable({ providedIn: 'root' })
export class DoctorAvailabilityApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/doctor-availability`;

  getMyAvailability(): Observable<ApiResponse<{ availability: DoctorAvailability }>> {
    return this.http.get<ApiResponse<{ availability: DoctorAvailability }>>(`${this.baseUrl}/me`);
  }

  updateMyAvailability(
    payload: UpdateAvailabilityRequest,
  ): Observable<ApiResponse<{ availability: DoctorAvailability }>> {
    return this.http.put<ApiResponse<{ availability: DoctorAvailability }>>(`${this.baseUrl}/me`, payload);
  }

  getMySlots(date: string): Observable<ApiResponse<SlotsResponse>> {
    return this.http.get<ApiResponse<SlotsResponse>>(`${this.baseUrl}/me/slots`, {
      params: new HttpParams().set('date', date),
    });
  }

  getAvailability(doctorProfileId: string): Observable<ApiResponse<{ availability: DoctorAvailability }>> {
    return this.http.get<ApiResponse<{ availability: DoctorAvailability }>>(
      `${this.baseUrl}/${doctorProfileId}`,
    );
  }

  getSlots(doctorProfileId: string, date: string): Observable<ApiResponse<SlotsResponse>> {
    return this.http.get<ApiResponse<SlotsResponse>>(`${this.baseUrl}/${doctorProfileId}/slots`, {
      params: new HttpParams().set('date', date),
    });
  }
}
