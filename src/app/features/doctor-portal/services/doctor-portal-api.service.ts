import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import {
  ApiClinic,
  ApiDoctorProfile,
  ApiSchedule,
} from '../models/doctor-api.model';

@Injectable({ providedIn: 'root' })
export class DoctorPortalApiService {
  private readonly api = inject(ApiClientService);

  getMyProfile(): Observable<ApiDoctorProfile> {
    return this.api
      .get<{ doctor: ApiDoctorProfile }>('/doctors/me')
      .pipe(map((res: ApiResponse<{ doctor: ApiDoctorProfile }>) => res.data.doctor));
  }

  updateMyProfile(
    payload: Record<string, unknown>,
  ): Observable<ApiDoctorProfile> {
    return this.api
      .patch<{ doctor: ApiDoctorProfile }>('/doctors/me', payload)
      .pipe(map((res) => res.data.doctor));
  }

  listMyClinics(): Observable<ApiClinic[]> {
    return this.api
      .get<{ clinics: ApiClinic[] }>('/clinics/me')
      .pipe(map((res) => res.data.clinics));
  }

  createClinic(payload: {
    name: string;
    address: string;
    city: string;
    consultationFee?: number;
  }): Observable<ApiClinic> {
    return this.api
      .post<{ clinic: ApiClinic }>('/clinics', payload)
      .pipe(map((res) => res.data.clinic));
  }

  updateClinic(
    id: string,
    payload: {
      name?: string;
      address?: string;
      city?: string;
      consultationFee?: number;
    },
  ): Observable<ApiClinic> {
    return this.api
      .put<{ clinic: ApiClinic }>(`/clinics/${id}`, payload)
      .pipe(map((res) => res.data.clinic));
  }

  listMySchedules(): Observable<ApiSchedule[]> {
    return this.api
      .get<{ schedules: ApiSchedule[] }>('/schedules/me')
      .pipe(map((res) => res.data.schedules));
  }

  createSchedule(payload: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    consultationType: 'video' | 'clinic';
    clinicId?: string;
  }): Observable<ApiSchedule> {
    return this.api
      .post<{ schedule: ApiSchedule }>('/schedules', payload)
      .pipe(map((res) => res.data.schedule));
  }

  deactivateSchedule(id: string): Observable<void> {
    return this.api.delete(`/schedules/${id}`).pipe(map(() => undefined));
  }
}
