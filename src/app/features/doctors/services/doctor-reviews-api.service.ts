import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { PaginationMeta } from '../../../core/models/doctor.model';
import { DoctorReview, CreateDoctorReviewRequest, DoctorReviewsQuery } from '../../../core/models/review.model';

@Injectable({ providedIn: 'root' })
export class DoctorReviewsApiService {
  private readonly api = inject(ApiClientService);

  listByDoctor(
    doctorId: string,
    query: DoctorReviewsQuery = {},
  ): Observable<ApiResponse<{ reviews: DoctorReview[]; pagination: PaginationMeta }>> {
    return this.api.get<{ reviews: DoctorReview[]; pagination: PaginationMeta }>(
      `/doctors/${doctorId}/reviews`,
      { params: query as Record<string, string | number | undefined> },
    );
  }

  create(
    doctorId: string,
    payload: CreateDoctorReviewRequest,
  ): Observable<ApiResponse<{ review: DoctorReview }>> {
    return this.api.post<{ review: DoctorReview }>(`/doctors/${doctorId}/reviews`, payload);
  }
}
