import { MedicalSpecialty } from './medical-specialty.model';
import { Language } from './language.model';

export type DoctorVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface DoctorQualification {
  degree: string;
  institution: string;
  year?: number;
  certificateUrl?: string;
}

export interface DoctorWorkHistory {
  organization: string;
  position: string;
  startYear?: number;
  endYear?: number;
  isCurrent?: boolean;
}

export interface DoctorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  isEmailVerified?: boolean;
  role?: string;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  user?: DoctorUser;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  title?: string;
  licenseNumber?: string;
  licenseAuthority?: string;
  medicalRegistrationNumber?: string;
  about?: string;
  yearsOfExperience?: number;
  experienceSummary?: string;
  workHistory: DoctorWorkHistory[];
  specialtyIds: string[];
  specialties?: MedicalSpecialty[];
  qualifications: DoctorQualification[];
  languageIds: string[];
  languages?: Language[];
  consultationFee?: number;
  currency?: string;
  verificationStatus: DoctorVerificationStatus;
  verificationNotes?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorListQuery {
  page: number;
  limit: number;
  search: string;
  verificationStatus: '' | DoctorVerificationStatus;
  specialtyId: string;
  isActive: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  title?: string;
  licenseNumber?: string;
  licenseAuthority?: string;
  medicalRegistrationNumber?: string;
  about?: string;
  yearsOfExperience?: number;
  experienceSummary?: string;
  workHistory?: DoctorWorkHistory[];
  specialtyIds?: string[];
  qualifications?: DoctorQualification[];
  languageIds?: string[];
  consultationFee?: number;
  currency?: string;
  profileImageUrl?: string;
}

export interface UpdateDoctorRequest extends Partial<Omit<CreateDoctorRequest, 'password'>> {
  isActive?: boolean;
  verificationStatus?: DoctorVerificationStatus;
  verificationNotes?: string;
}

export interface UpdateMyDoctorProfileRequest extends Partial<Omit<CreateDoctorRequest, 'firstName' | 'lastName' | 'email' | 'phone' | 'password'>> {}

export interface VerifyDoctorRequest {
  verificationStatus: DoctorVerificationStatus;
  verificationNotes?: string;
}

export const DEFAULT_DOCTOR_LIST_QUERY: DoctorListQuery = {
  page: 1,
  limit: 10,
  search: '',
  verificationStatus: '',
  specialtyId: '',
  isActive: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export interface DoctorSearchClinic {
  id: string;
  name: string;
  city: string;
}

export interface DoctorSearchResult {
  id: string;
  userId: string;
  user?: Pick<DoctorUser, 'id' | 'firstName' | 'lastName'>;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  city?: string;
  country?: string;
  title?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  currency?: string;
  profileImageUrl?: string;
  about?: string;
  qualifications?: DoctorQualification[];
  specialtyIds: string[];
  specialties?: MedicalSpecialty[];
  languageIds: string[];
  languages?: Language[];
  clinics?: DoctorSearchClinic[];
  availableDays?: number[];
  averageRating?: number;
  reviewCount?: number;
}

export interface DoctorSearchQuery {
  page: number;
  limit: number;
  name: string;
  specialtyId: string;
  clinicId: string;
  city: string;
  minFee: string;
  maxFee: string;
  languageId: string;
  gender: '' | 'MALE' | 'FEMALE' | 'OTHER';
  minExperience: string;
  maxExperience: string;
  availableDay: string;
  availableDate: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const DAY_OF_WEEK_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Any day' },
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

export const DEFAULT_DOCTOR_SEARCH_QUERY: DoctorSearchQuery = {
  page: 1,
  limit: 12,
  name: '',
  specialtyId: '',
  clinicId: '',
  city: '',
  minFee: '',
  maxFee: '',
  languageId: '',
  gender: '',
  minExperience: '',
  maxExperience: '',
  availableDay: '',
  availableDate: '',
  sortBy: 'yearsOfExperience',
  sortOrder: 'desc',
};

export function dayLabel(day: number): string {
  return DAY_OF_WEEK_OPTIONS.find((d) => d.value === String(day))?.label ?? '';
}
