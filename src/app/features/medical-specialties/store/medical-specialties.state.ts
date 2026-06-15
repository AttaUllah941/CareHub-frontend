import {
  DEFAULT_MEDICAL_SPECIALTY_LIST_QUERY,
  MedicalSpecialty,
  MedicalSpecialtyListQuery,
} from '../../../core/models/medical-specialty.model';

export interface MedicalSpecialtiesState {
  specialties: MedicalSpecialty[];
  allSpecialties: MedicalSpecialty[];
  selectedSpecialty: MedicalSpecialty | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: MedicalSpecialtyListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const MEDICAL_SPECIALTIES_FEATURE_KEY = 'medicalSpecialties';

export const initialMedicalSpecialtiesState: MedicalSpecialtiesState = {
  specialties: [],
  allSpecialties: [],
  selectedSpecialty: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_MEDICAL_SPECIALTY_LIST_QUERY },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
