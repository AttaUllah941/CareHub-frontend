import { PaginationMeta } from './doctor.model';

export interface LabTest {
  id: string;
  labId: string;
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  price: number;
  currency: string;
  homeCollectionAvailable: boolean;
  sampleType?: string;
  turnaroundTime?: string;
  preparation?: string;
}

export interface PublicLab {
  id: string;
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  address?: string;
  phone?: string;
  email?: string;
  timings?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  testCount?: number;
  tests?: LabTest[];
  isHomeCollection?: boolean;
}

export interface LabListQuery {
  page?: number;
  limit?: number;
  city?: string;
  citySlug?: string;
}

export interface LabTestListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface LabBookingPatientSnapshot {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface CreateLabBookingRequest {
  labId: string;
  testIds: string[];
  scheduledDate: string;
  scheduledSlot: string;
  collectionType: 'home_sample' | 'lab_visit';
  patient: LabBookingPatientSnapshot;
}
