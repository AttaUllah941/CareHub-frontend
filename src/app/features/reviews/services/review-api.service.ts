import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/appointment.model';
import {
  CreateReviewRequest,
  ModerateReviewRequest,
  Review,
  ReviewListQuery,
  ReviewRatingStats,
  UpdateReviewRequest,
} from '../../../core/models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reviews`;

  getMyReviews(): Observable<ApiResponse<{ reviews: Review[] }>> {
    return this.http.get<ApiResponse<{ reviews: Review[] }>>(`${this.baseUrl}/me`);
  }

  getDoctorReviews(): Observable<ApiResponse<{ reviews: Review[] }>> {
    return this.http.get<ApiResponse<{ reviews: Review[] }>>(`${this.baseUrl}/doctor`);
  }

  getByDoctorProfileId(
    doctorProfileId: string,
  ): Observable<ApiResponse<{ reviews: Review[]; stats: ReviewRatingStats }>> {
    return this.http.get<ApiResponse<{ reviews: Review[]; stats: ReviewRatingStats }>>(
      `${this.baseUrl}/doctor/${doctorProfileId}`,
    );
  }

  getDoctorStats(doctorProfileId: string): Observable<ApiResponse<{ stats: ReviewRatingStats }>> {
    return this.http.get<ApiResponse<{ stats: ReviewRatingStats }>>(
      `${this.baseUrl}/doctor/${doctorProfileId}/stats`,
    );
  }

  getByAppointmentId(appointmentId: string): Observable<ApiResponse<{ review: Review }>> {
    return this.http.get<ApiResponse<{ review: Review }>>(`${this.baseUrl}/appointment/${appointmentId}`);
  }

  createForAppointment(
    appointmentId: string,
    payload: CreateReviewRequest,
  ): Observable<ApiResponse<{ review: Review }>> {
    return this.http.post<ApiResponse<{ review: Review }>>(
      `${this.baseUrl}/appointment/${appointmentId}`,
      payload,
    );
  }

  getReviews(
    query: ReviewListQuery,
  ): Observable<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta }>> {
    return this.http.get<ApiResponse<{ reviews: Review[]; pagination: PaginationMeta }>>(this.baseUrl, {
      params: this.buildParams(query as unknown as Record<string, string | number>),
    });
  }

  getReviewById(id: string): Observable<ApiResponse<{ review: Review }>> {
    return this.http.get<ApiResponse<{ review: Review }>>(`${this.baseUrl}/${id}`);
  }

  updateReview(id: string, payload: UpdateReviewRequest): Observable<ApiResponse<{ review: Review }>> {
    return this.http.put<ApiResponse<{ review: Review }>>(`${this.baseUrl}/${id}`, payload);
  }

  moderateReview(id: string, payload: ModerateReviewRequest): Observable<ApiResponse<{ review: Review }>> {
    return this.http.patch<ApiResponse<{ review: Review }>>(`${this.baseUrl}/${id}/moderate`, payload);
  }

  deleteReview(id: string): Observable<ApiResponse<{ message: string }>> {
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
