import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { PaginationMeta } from '../../../core/models/doctor.model';
import {
  CreateLabBookingRequest,
  LabListQuery,
  LabTest,
  LabTestListQuery,
  PublicLab,
} from '../../../core/models/lab.model';

interface LabBooking {
  id: string;
  bookingRef?: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class LabsApiService {
  private readonly api = inject(ApiClientService);

  listPublic(
    query: LabListQuery = {},
  ): Observable<ApiResponse<{ labs: PublicLab[]; pagination: PaginationMeta }>> {
    return this.api.get<{ labs: PublicLab[]; pagination: PaginationMeta }>('/labs/public', {
      params: query as Record<string, string | number | undefined>,
    });
  }

  getPublicDetail(id: string): Observable<ApiResponse<{ lab: PublicLab }>> {
    return this.api.get<{ lab: PublicLab }>(`/labs/public/${id}`);
  }

  listPublicTests(
    labId: string,
    query: LabTestListQuery = {},
  ): Observable<ApiResponse<{ tests: LabTest[]; pagination: PaginationMeta }>> {
    return this.api.get<{ tests: LabTest[]; pagination: PaginationMeta }>(
      `/labs/public/${labId}/tests`,
      { params: query as Record<string, string | number | undefined> },
    );
  }

  createBooking(
    payload: CreateLabBookingRequest,
  ): Observable<ApiResponse<{ booking: LabBooking }>> {
    return this.api.post<{ booking: LabBooking }>('/lab-bookings', payload);
  }
}
