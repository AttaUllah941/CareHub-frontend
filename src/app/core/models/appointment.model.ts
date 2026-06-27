import { PaginationMeta } from './doctor.model';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type ConsultationType = 'video' | 'clinic';

export interface Appointment {
  id: string;
  bookingRef: string | null;
  doctorId: string;
  doctorName?: string;
  patientId: string | null;
  status: AppointmentStatus;
  scheduledAt: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  consultationType?: ConsultationType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  scheduledAt: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  consultationType?: ConsultationType;
}

export interface AppointmentListQuery {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  pagination: PaginationMeta;
}
