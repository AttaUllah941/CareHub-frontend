import { User, UserRole } from '../../../core/models/auth.model';
import { PaginationMeta } from '../../../core/models/doctor.model';

export interface AdminDashboardStats {
  totalUsers: number;
  doctorsByVerificationStatus: Record<string, number>;
  appointmentsThisWeek: Record<string, number>;
  ordersToday: Record<string, number>;
  labBookingsPending: number;
}

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: 'true' | 'false';
}

export interface AdminUser extends User {
  updatedAt?: string;
}

export type DoctorApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface DoctorApplicationDocument {
  type: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface DoctorApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documents: DoctorApplicationDocument[];
  status: DoctorApplicationStatus;
  userId?: string;
  doctorId?: string;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorApplicationListQuery {
  page?: number;
  limit?: number;
  status?: DoctorApplicationStatus;
}

export interface PaginatedUsers {
  users: AdminUser[];
  pagination: PaginationMeta;
}

export interface PaginatedDoctorApplications {
  applications: DoctorApplication[];
  pagination: PaginationMeta;
}
