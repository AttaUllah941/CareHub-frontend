import { Clinic, ClinicListQuery } from '../../../core/models/clinic.model';

export interface ClinicsState {
  clinics: Clinic[];
  allClinics: Clinic[];
  selectedClinic: Clinic | null;
  myClinic: Clinic | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: ClinicListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const CLINICS_FEATURE_KEY = 'clinics';

export const initialClinicsState: ClinicsState = {
  clinics: [],
  allClinics: [],
  selectedClinic: null,
  myClinic: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  query: {
    page: 1,
    limit: 10,
    search: '',
    city: '',
    country: '',
    isActive: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
