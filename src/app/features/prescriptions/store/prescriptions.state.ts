import {
  Prescription,
  PrescriptionListQuery,
  DEFAULT_PRESCRIPTION_LIST_QUERY,
} from '../../../core/models/prescription.model';

export interface PrescriptionsState {
  prescriptions: Prescription[];
  myPrescriptions: Prescription[];
  doctorPrescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: PrescriptionListQuery;
  loading: boolean;
  saving: boolean;
  downloading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const PRESCRIPTIONS_FEATURE_KEY = 'prescriptions';

export const initialPrescriptionsState: PrescriptionsState = {
  prescriptions: [],
  myPrescriptions: [],
  doctorPrescriptions: [],
  selectedPrescription: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_PRESCRIPTION_LIST_QUERY },
  loading: false,
  saving: false,
  downloading: false,
  error: null,
  successMessage: null,
};
