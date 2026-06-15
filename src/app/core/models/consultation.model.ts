import { Appointment } from './appointment.model';

export interface Consultation {
  id: string;
  appointmentId: string;
  diagnosis?: string;
  observations?: string;
  doctorNotes?: string;
  recommendations?: string;
  createdByUserId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  appointment?: Appointment;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface ConsultationListQuery {
  page: number;
  limit: number;
  patientProfileId: string;
  doctorProfileId: string;
  appointmentId: string;
  search: string;
  sortBy: 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

export interface CreateConsultationRequest {
  diagnosis?: string;
  observations?: string;
  doctorNotes?: string;
  recommendations?: string;
}

export interface UpdateConsultationRequest extends CreateConsultationRequest {}

export const DEFAULT_CONSULTATION_LIST_QUERY: ConsultationListQuery = {
  page: 1,
  limit: 10,
  patientProfileId: '',
  doctorProfileId: '',
  appointmentId: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function formatConsultationDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
