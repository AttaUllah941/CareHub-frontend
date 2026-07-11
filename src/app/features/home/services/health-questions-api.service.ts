import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/models/api.model';
import { PaginationMeta } from '../../../core/models/doctor.model';

export interface SubmitHealthQuestionRequest {
  question: string;
  category: string;
  city?: string;
  isAnonymous?: boolean;
  askerName?: string;
  age?: number | null;
  gender?: '' | 'male' | 'female' | 'other';
}

export interface HealthQuestionItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  city?: string;
  isAnonymous: boolean;
  askerName?: string;
  doctorName?: string;
  specialty?: string;
  specialtySlug: string;
  views: number;
  status: 'pending' | 'answered';
  createdAt?: string;
}

export interface HealthQuestionListResponse {
  questions: HealthQuestionItem[];
  pagination: PaginationMeta;
}

@Injectable({ providedIn: 'root' })
export class HealthQuestionsApiService {
  private readonly api = inject(ApiClientService);

  submit(payload: SubmitHealthQuestionRequest): Observable<ApiResponse<{ question: HealthQuestionItem }>> {
    return this.api.post<{ question: HealthQuestionItem }>('/health-questions', payload);
  }

  listPublic(query: Record<string, string | number | undefined> = {}): Observable<ApiResponse<HealthQuestionListResponse>> {
    return this.api.get<HealthQuestionListResponse>('/health-questions/public', { params: query });
  }

  listMine(query: Record<string, string | number | undefined> = {}): Observable<ApiResponse<HealthQuestionListResponse>> {
    return this.api.get<HealthQuestionListResponse>('/health-questions/me', { params: query });
  }
}
