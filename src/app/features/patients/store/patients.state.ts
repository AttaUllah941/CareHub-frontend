import { Patient, PatientListQuery } from '../../../core/models/patient.model';

export interface PatientsState {
  patients: Patient[];
  selectedPatient: Patient | null;
  myProfile: Patient | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: PatientListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const PATIENTS_FEATURE_KEY = 'patients';

export const initialPatientsState: PatientsState = {
  patients: [],
  selectedPatient: null,
  myProfile: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  query: {
    page: 1,
    limit: 10,
    search: '',
    bloodGroup: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
