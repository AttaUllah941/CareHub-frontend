import { DoctorSearchResult, PaginationMeta } from './doctor.model';
import { Hospital } from './hospital.model';

export interface SurgeryProcedure {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  estimatedCostRange?: { min: number; max: number };
  priceFrom: number;
  priceTo?: number;
  currency?: string;
  hospitalIds: string[];
  hospitalCount?: number;
  duration?: string;
  anesthesiaType?: string;
  hospitalStay?: string;
}

export interface SurgeryHospitalView {
  id: string;
  slug: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  citySlug: string;
  country: string;
  imageUrl: string;
  rating: number;
  is24Hours: boolean;
  facilities: string[];
  surgeryIds: string[];
  doctorIds: string[];
  surgeries?: SurgeryProcedure[];
  surgeryCount?: number;
  specialists?: DoctorSearchResult[];
  specialistCount?: number;
}

export interface SurgeryProcedureListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface SurgeryConsultationPatientSnapshot {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface CreateSurgeryConsultationRequest {
  procedureId: string;
  hospitalId: string;
  patient: SurgeryConsultationPatientSnapshot;
}

export type SurgeryConsultationStatus = 'pending' | 'contacted' | 'scheduled' | 'closed';

export interface SurgeryConsultationRequest {
  id: string;
  procedureId: string;
  hospitalId: string;
  patientId: string | null;
  patientSnapshot: SurgeryConsultationPatientSnapshot;
  status: SurgeryConsultationStatus;
  procedure?: {
    id: string;
    name: string;
    slug: string;
    category?: string;
    estimatedCostRange?: { min: number; max: number };
    currency?: string;
  };
  hospital?: {
    id: string;
    name: string;
    slug: string;
    city: string;
    citySlug: string;
    address?: string;
    rating?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SurgeryConsultationListQuery {
  page?: number;
  limit?: number;
  status?: SurgeryConsultationStatus;
}

export interface SurgeryConsultationListResponse {
  consultationRequests: SurgeryConsultationRequest[];
  pagination: PaginationMeta;
}
