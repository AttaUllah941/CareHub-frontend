export type ReviewStatus = 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';

export interface ReviewRatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface Review {
  id: string;
  appointmentId: string;
  consultationId?: string | null;
  doctorProfileId: string;
  patientProfileId: string;
  clinicId: string;
  rating: number;
  title?: string;
  comment?: string;
  status: ReviewStatus;
  moderationNote?: string;
  moderatedByUserId?: string | null;
  moderatedAt?: string | null;
  createdByUserId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  appointment?: {
    id: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: string;
    patient?: {
      id: string;
      user?: { firstName?: string; lastName?: string; email?: string };
    };
    doctor?: {
      id: string;
      title?: string;
      user?: { firstName?: string; lastName?: string; email?: string };
    };
    clinic?: { id: string; name?: string; city?: string };
    familyMember?: {
      id: string;
      firstName: string;
      lastName: string;
      relationship: string;
    };
  };
  doctor?: {
    id: string;
    title?: string;
    user?: { firstName?: string; lastName?: string; email?: string };
  };
  patient?: {
    id: string;
    user?: { firstName?: string; lastName?: string; email?: string };
  };
  clinic?: { id: string; name?: string; city?: string };
  createdBy?: { id: string; firstName: string; lastName: string; email?: string };
  moderatedBy?: { id: string; firstName: string; lastName: string; email?: string };
}

export interface ReviewListQuery {
  page: number;
  limit: number;
  patientProfileId: string;
  doctorProfileId: string;
  clinicId: string;
  status: string;
  rating: string;
  search: string;
  sortBy: 'createdAt' | 'updatedAt' | 'rating';
  sortOrder: 'asc' | 'desc';
}

export interface CreateReviewRequest {
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest extends CreateReviewRequest {
  status?: ReviewStatus;
  moderationNote?: string;
}

export interface ModerateReviewRequest {
  status: ReviewStatus;
  moderationNote?: string;
}

export const REVIEW_STATUS_OPTIONS: { value: ReviewStatus; label: string }[] = [
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'HIDDEN', label: 'Hidden' },
  { value: 'FLAGGED', label: 'Flagged' },
];

export const DEFAULT_REVIEW_LIST_QUERY: ReviewListQuery = {
  page: 1,
  limit: 10,
  patientProfileId: '',
  doctorProfileId: '',
  clinicId: '',
  status: '',
  rating: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function reviewStatusLabel(status: ReviewStatus): string {
  return REVIEW_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function reviewStatusClass(status: ReviewStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-50 text-green-700';
    case 'HIDDEN':
      return 'bg-gray-100 text-gray-600';
    case 'FLAGGED':
      return 'bg-amber-50 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export function formatReviewDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function starLabel(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
