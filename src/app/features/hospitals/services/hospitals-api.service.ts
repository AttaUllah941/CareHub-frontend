import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { Hospital, HospitalListQuery } from '../../../core/models/hospital.model';
import { PaginationMeta } from '../../../core/models/doctor.model';

@Injectable({ providedIn: 'root' })
export class HospitalsApiService {
  private readonly api = inject(ApiClientService);

  listPublic(
    query: HospitalListQuery = {},
  ): Observable<ApiResponse<{ hospitals: Hospital[]; pagination: PaginationMeta }>> {
    return this.api.get<{ hospitals: Hospital[]; pagination: PaginationMeta }>('/hospitals/public', {
      params: query as Record<string, string | number | undefined>,
    });
  }

  getPublicDetail(
    citySlug: string,
    slug: string,
  ): Observable<ApiResponse<{ hospital: Hospital }>> {
    return this.api.get<{ hospital: Hospital }>(`/hospitals/public/${citySlug}/${slug}`);
  }
}
