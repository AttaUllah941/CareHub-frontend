import { createReducer, on } from '@ngrx/store';
import { DEFAULT_CONSULTATION_LIST_QUERY } from '../../../core/models/consultation.model';
import { ConsultationsActions } from './consultations.actions';
import { initialConsultationsState } from './consultations.state';

const setSaving = (state: typeof initialConsultationsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialConsultationsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const consultationsReducer = createReducer(
  initialConsultationsState,

  on(ConsultationsActions.loadConsultations, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_CONSULTATION_LIST_QUERY, ...state.query, ...query },
  })),
  on(ConsultationsActions.loadConsultationsSuccess, (state, { consultations, pagination, query }) => ({
    ...state,
    consultations,
    pagination,
    query,
    loading: false,
  })),
  on(ConsultationsActions.loadConsultationsFailure, setFailure),

  on(
    ConsultationsActions.loadMyConsultations,
    ConsultationsActions.loadDoctorConsultations,
    ConsultationsActions.loadByAppointment,
    ConsultationsActions.loadConsultationById,
    (state) => ({ ...state, loading: true, error: null }),
  ),
  on(ConsultationsActions.loadMyConsultationsSuccess, (state, { consultations }) => ({
    ...state,
    myConsultations: consultations,
    loading: false,
  })),
  on(ConsultationsActions.loadDoctorConsultationsSuccess, (state, { consultations }) => ({
    ...state,
    doctorConsultations: consultations,
    loading: false,
  })),
  on(
    ConsultationsActions.loadByAppointmentSuccess,
    ConsultationsActions.loadConsultationByIdSuccess,
    (state, { consultation }) => ({
      ...state,
      selectedConsultation: consultation,
      loading: false,
    }),
  ),
  on(
    ConsultationsActions.loadMyConsultationsFailure,
    ConsultationsActions.loadDoctorConsultationsFailure,
    ConsultationsActions.loadByAppointmentFailure,
    ConsultationsActions.loadConsultationByIdFailure,
    setFailure,
  ),
  on(ConsultationsActions.clearSelectedConsultation, (state) => ({
    ...state,
    selectedConsultation: null,
  })),

  on(
    ConsultationsActions.createConsultation,
    ConsultationsActions.updateConsultation,
    ConsultationsActions.deleteConsultation,
    setSaving,
  ),
  on(ConsultationsActions.createConsultationSuccess, (state, { consultation, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedConsultation: consultation,
    doctorConsultations: upsert(state.doctorConsultations, consultation),
    myConsultations: upsert(state.myConsultations, consultation),
    consultations: upsert(state.consultations, consultation),
  })),
  on(ConsultationsActions.updateConsultationSuccess, (state, { consultation, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedConsultation: consultation,
    doctorConsultations: upsert(state.doctorConsultations, consultation),
    myConsultations: upsert(state.myConsultations, consultation),
    consultations: upsert(state.consultations, consultation),
  })),
  on(ConsultationsActions.deleteConsultationSuccess, (state, { message, id }) => ({
    ...state,
    saving: false,
    successMessage: message,
    consultations: state.consultations.filter((c) => c.id !== id),
    doctorConsultations: state.doctorConsultations.filter((c) => c.id !== id),
    myConsultations: state.myConsultations.filter((c) => c.id !== id),
    selectedConsultation: state.selectedConsultation?.id === id ? null : state.selectedConsultation,
  })),
  on(
    ConsultationsActions.createConsultationFailure,
    ConsultationsActions.updateConsultationFailure,
    ConsultationsActions.deleteConsultationFailure,
    setFailure,
  ),

  on(ConsultationsActions.clearError, (state) => ({ ...state, error: null })),
  on(ConsultationsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);

function upsert(
  list: import('../../../core/models/consultation.model').Consultation[],
  consultation: import('../../../core/models/consultation.model').Consultation,
) {
  return list.some((c) => c.id === consultation.id)
    ? list.map((c) => (c.id === consultation.id ? consultation : c))
    : [consultation, ...list];
}
