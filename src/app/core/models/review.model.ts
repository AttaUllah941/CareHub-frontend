import { PaginationMeta } from './doctor.model';

export interface DoctorReview {
  id: string;
  patientName: string;
  patientInitials: string;
  rating: number;
  headline: string;
  body: string;
  tags: string[];
  date: string;
}

export interface DoctorReviewsQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateDoctorReviewRequest {
  rating: number;
  headline: string;
  body: string;
  tags?: string[];
}
