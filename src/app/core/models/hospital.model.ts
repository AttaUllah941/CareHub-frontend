import { PaginationMeta } from './doctor.model';

export interface HospitalDoctorSummary {
  id: string;
  fullName: string;
  verificationStatus?: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  description?: string;
  address?: string;
  images?: string[];
  facilities?: string[];
  doctorIds: string[];
  doctorCount: number;
  rating?: number;
  reviewCount?: number;
  doctors?: HospitalDoctorSummary[];
}

/** UI-ready hospital shape used by listing/detail templates */
export interface PublicHospitalView extends Hospital {
  imageUrl: string;
  specialties: string[];
  is24Hours: boolean;
  phone: string;
  email: string;
  country: string;
}

export interface HospitalListQuery {
  page?: number;
  limit?: number;
  city?: string;
  citySlug?: string;
  search?: string;
}
