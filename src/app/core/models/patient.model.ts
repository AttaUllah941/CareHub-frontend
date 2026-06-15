export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE';

export interface PatientAllergy {
  id?: string;
  name: string;
  severity: AllergySeverity;
  reaction?: string;
}

export interface PatientMedicalInformation {
  chronicConditions: string[];
  currentMedications: string[];
  pastSurgeries: string[];
  notes?: string;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface PatientUser {
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

export interface Patient {
  id: string;
  userId: string;
  user?: PatientUser;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bloodGroup?: BloodGroup;
  allergies: PatientAllergy[];
  medicalInformation: PatientMedicalInformation;
  emergencyContact: EmergencyContact;
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

export interface PatientListQuery {
  page: number;
  limit: number;
  search: string;
  bloodGroup: '' | BloodGroup;
  isActive: '' | 'true' | 'false';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bloodGroup?: BloodGroup;
  allergies?: PatientAllergy[];
  medicalInformation?: PatientMedicalInformation;
  emergencyContact?: EmergencyContact;
  profileImageUrl?: string;
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bloodGroup?: BloodGroup;
  allergies?: PatientAllergy[];
  medicalInformation?: PatientMedicalInformation;
  emergencyContact?: EmergencyContact;
  profileImageUrl?: string;
}

export interface UpdateMyPatientProfileRequest {
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bloodGroup?: BloodGroup;
  allergies?: PatientAllergy[];
  medicalInformation?: PatientMedicalInformation;
  emergencyContact?: EmergencyContact;
  profileImageUrl?: string;
}

export const BLOOD_GROUP_OPTIONS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const ALLERGY_SEVERITY_OPTIONS: AllergySeverity[] = ['MILD', 'MODERATE', 'SEVERE'];

export const DEFAULT_PATIENT_LIST_QUERY: PatientListQuery = {
  page: 1,
  limit: 10,
  search: '',
  bloodGroup: '',
  isActive: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const EMPTY_MEDICAL_INFORMATION: PatientMedicalInformation = {
  chronicConditions: [],
  currentMedications: [],
  pastSurgeries: [],
  notes: '',
};
