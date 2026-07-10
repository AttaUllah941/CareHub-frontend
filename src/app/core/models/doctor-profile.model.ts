import { DoctorSearchResult } from './doctor.model';
import { DoctorReview } from './review.model';

export interface DoctorRatingBreakdown {
  patientSatisfaction: number;
  diagnosis: number;
  staffBehaviour: number;
  clinicEnvironment: number;
}

export type ConsultationFacilityType = 'clinic' | 'hospital' | 'lab';

export interface DoctorConsultationOption {
  id: string;
  type: 'video' | 'clinic';
  name: string;
  address?: string;
  location?: string;
  facilityType?: ConsultationFacilityType;
  fee: number;
  currency: string;
  hours: string;
  status: string;
}

export interface DoctorDetailProfile extends DoctorSearchResult {
  role?: string;
  averageRating: number;
  reviewCount: number;
  waitTimeMins: number;
  avgTimeToPatientMins: number;
  ratingBreakdown: DoctorRatingBreakdown;
  reviews: DoctorReview[];
  consultationOptions: DoctorConsultationOption[];
  timeSlots: string[];
}
