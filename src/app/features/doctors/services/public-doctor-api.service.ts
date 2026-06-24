import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { DoctorSearchResult, PaginationMeta } from '../../../core/models/doctor.model';
import { DoctorDetailProfile } from '../../../core/models/doctor-profile.model';
import { MedicalSpecialty } from '../../../core/models/medical-specialty.model';

export interface PublicDoctorSearchQuery {
  page?: number;
  limit?: number;
  name?: string;
  specialtySlug?: string;
  city?: string;
  minFee?: string;
  maxFee?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class PublicDoctorApiService {
  private readonly http = inject(HttpClient);
  private readonly doctorsUrl = `${environment.apiUrl}/doctors/public/search`;
  private readonly doctorDetailUrl = `${environment.apiUrl}/doctors/public`;
  private readonly specialtiesUrl = `${environment.apiUrl}/medical-specialties/public`;

  searchDoctors(
    query: PublicDoctorSearchQuery,
  ): Observable<ApiResponse<{ doctors: DoctorSearchResult[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ doctors: DoctorSearchResult[]; pagination: PaginationMeta }>>(
      this.doctorsUrl,
      { params: this.buildParams(query as Record<string, string | number>) },
    );
  }

  getSpecialties(): Observable<ApiResponse<{ specialties: MedicalSpecialty[] }>> {
    return this.http.get<ApiResponse<{ specialties: MedicalSpecialty[] }>>(this.specialtiesUrl);
  }

  getDoctorById(id: string): Observable<ApiResponse<{ doctor: DoctorDetailProfile }>> {
    return this.http.get<ApiResponse<{ doctor: DoctorDetailProfile }>>(`${this.doctorDetailUrl}/${id}`);
  }

  private buildParams(query: Record<string, string | number | undefined>): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
