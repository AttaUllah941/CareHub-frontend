import { Consultation } from './consultation.model';

export interface PrescriptionMedicine {
  id?: string;
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  medicines: PrescriptionMedicine[];
  notes?: string;
  createdByUserId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  consultation?: Consultation;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface PrescriptionListQuery {
  page: number;
  limit: number;
  patientProfileId: string;
  doctorProfileId: string;
  consultationId: string;
  search: string;
  sortBy: 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

export interface CreatePrescriptionRequest {
  medicines: PrescriptionMedicine[];
  notes?: string;
}

export interface UpdatePrescriptionRequest extends CreatePrescriptionRequest {}

export const DEFAULT_PRESCRIPTION_LIST_QUERY: PrescriptionListQuery = {
  page: 1,
  limit: 10,
  patientProfileId: '',
  doctorProfileId: '',
  consultationId: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function formatPrescriptionDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
