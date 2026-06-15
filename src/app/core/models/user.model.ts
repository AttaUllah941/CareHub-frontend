import { UserRole } from './auth.model';

export interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  fullName?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListQuery {
  page: number;
  limit: number;
  search: string;
  role: UserRole | '';
  isActive: '' | 'true' | 'false';
  isEmailVerified: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export const DEFAULT_USER_LIST_QUERY: UserListQuery = {
  page: 1,
  limit: 10,
  search: '',
  role: '',
  isActive: '',
  isEmailVerified: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const USER_SORT_FIELDS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Role' },
  { value: 'lastLoginAt', label: 'Last Login' },
  { value: 'isActive', label: 'Status' },
] as const;

export const USER_ROLE_OPTIONS = [
  { value: UserRole.PATIENT, label: 'Patient' },
  { value: UserRole.DOCTOR, label: 'Doctor' },
  { value: UserRole.CLINIC_MANAGER, label: 'Clinic Manager' },
  { value: UserRole.ADMIN, label: 'Admin' },
  { value: UserRole.SUPER_ADMIN, label: 'Super Admin' },
] as const;
