import {
  Consultation,
  ConsultationListQuery,
  DEFAULT_CONSULTATION_LIST_QUERY,
} from '../../../core/models/consultation.model';

export interface ConsultationsState {
  consultations: Consultation[];
  myConsultations: Consultation[];
  doctorConsultations: Consultation[];
  selectedConsultation: Consultation | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: ConsultationListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const CONSULTATIONS_FEATURE_KEY = 'consultations';

export const initialConsultationsState: ConsultationsState = {
  consultations: [],
  myConsultations: [],
  doctorConsultations: [],
  selectedConsultation: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_CONSULTATION_LIST_QUERY },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
