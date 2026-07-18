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
  website?: string;
  timings?: string;
  description?: string;
  images?: string[];
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
  collectionType: 'home' | 'lab_visit';
  patient: LabBookingPatientSnapshot;
}

export type LabBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'sample_collected'
  | 'report_ready'
  | 'cancelled';

export interface LabBooking {
  id: string;
  labId: string;
  testIds: string[];
  patientId: string | null;
  patientSnapshot: LabBookingPatientSnapshot;
  scheduledDate: string;
  scheduledSlot: string;
  collectionType: 'home' | 'lab_visit';
  status: LabBookingStatus;
  totalPrice: number;
  currency: string;
  lab?: {
    id: string;
    name: string;
    slug: string;
    city: string;
    citySlug: string;
    address?: string;
  };
  tests?: LabTest[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LabBookingListQuery {
  page?: number;
  limit?: number;
  status?: LabBookingStatus;
}

export interface LabBookingListResponse {
  bookings: LabBooking[];
  pagination: PaginationMeta;
}
