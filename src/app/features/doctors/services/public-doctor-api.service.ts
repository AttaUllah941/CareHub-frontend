import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { DoctorSearchResult, PaginationMeta } from '../../../core/models/doctor.model';
import { DoctorDetailProfile } from '../../../core/models/doctor-profile.model';

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
  private readonly api = inject(ApiClientService);

  searchDoctors(
    query: PublicDoctorSearchQuery,
  ): Observable<ApiResponse<{ doctors: DoctorSearchResult[]; pagination: PaginationMeta }>> {
    return this.api.get<{ doctors: DoctorSearchResult[]; pagination: PaginationMeta }>(
      '/doctors/public/search',
      { params: query as Record<string, string | number | undefined> },
    );
  }

  getDoctorById(id: string): Observable<ApiResponse<{ doctor: DoctorDetailProfile }>> {
    return this.api.get<{ doctor: DoctorDetailProfile }>(`/doctors/public/${id}`);
  }
}
