import { createReducer, on } from '@ngrx/store';
import { DEFAULT_PRESCRIPTION_LIST_QUERY } from '../../../core/models/prescription.model';
import { PrescriptionsActions } from './prescriptions.actions';
import { initialPrescriptionsState } from './prescriptions.state';

const setSaving = (state: typeof initialPrescriptionsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialPrescriptionsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  downloading: false,
  error,
});

export const prescriptionsReducer = createReducer(
  initialPrescriptionsState,

  on(PrescriptionsActions.loadPrescriptions, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_PRESCRIPTION_LIST_QUERY, ...state.query, ...query },
  })),
  on(PrescriptionsActions.loadPrescriptionsSuccess, (state, { prescriptions, pagination, query }) => ({
    ...state,
    prescriptions,
    pagination,
    query,
    loading: false,
  })),
  on(PrescriptionsActions.loadPrescriptionsFailure, setFailure),

  on(
    PrescriptionsActions.loadMyPrescriptions,
    PrescriptionsActions.loadDoctorPrescriptions,
    PrescriptionsActions.loadByConsultation,
    (state) => ({ ...state, loading: true, error: null }),
  ),
  on(PrescriptionsActions.loadMyPrescriptionsSuccess, (state, { prescriptions }) => ({
    ...state,
    myPrescriptions: prescriptions,
    loading: false,
  })),
  on(PrescriptionsActions.loadDoctorPrescriptionsSuccess, (state, { prescriptions }) => ({
    ...state,
    doctorPrescriptions: prescriptions,
    loading: false,
  })),
  on(PrescriptionsActions.loadByConsultationSuccess, (state, { prescription }) => ({
    ...state,
    selectedPrescription: prescription,
    loading: false,
  })),
  on(
    PrescriptionsActions.loadMyPrescriptionsFailure,
    PrescriptionsActions.loadDoctorPrescriptionsFailure,
    PrescriptionsActions.loadByConsultationFailure,
    setFailure,
  ),
  on(PrescriptionsActions.clearSelectedPrescription, (state) => ({
    ...state,
    selectedPrescription: null,
  })),

  on(
    PrescriptionsActions.createPrescription,
    PrescriptionsActions.updatePrescription,
    PrescriptionsActions.deletePrescription,
    setSaving,
  ),
  on(PrescriptionsActions.createPrescriptionSuccess, (state, { prescription, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedPrescription: prescription,
    doctorPrescriptions: upsert(state.doctorPrescriptions, prescription),
    myPrescriptions: upsert(state.myPrescriptions, prescription),
    prescriptions: upsert(state.prescriptions, prescription),
  })),
  on(PrescriptionsActions.updatePrescriptionSuccess, (state, { prescription, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedPrescription: prescription,
    doctorPrescriptions: upsert(state.doctorPrescriptions, prescription),
    myPrescriptions: upsert(state.myPrescriptions, prescription),
    prescriptions: upsert(state.prescriptions, prescription),
  })),
  on(PrescriptionsActions.deletePrescriptionSuccess, (state, { message, id }) => ({
    ...state,
    saving: false,
    successMessage: message,
    prescriptions: state.prescriptions.filter((p) => p.id !== id),
    doctorPrescriptions: state.doctorPrescriptions.filter((p) => p.id !== id),
    myPrescriptions: state.myPrescriptions.filter((p) => p.id !== id),
    selectedPrescription: state.selectedPrescription?.id === id ? null : state.selectedPrescription,
  })),
  on(
    PrescriptionsActions.createPrescriptionFailure,
    PrescriptionsActions.updatePrescriptionFailure,
    PrescriptionsActions.deletePrescriptionFailure,
    setFailure,
  ),

  on(PrescriptionsActions.downloadPdf, (state) => ({ ...state, downloading: true, error: null })),
  on(PrescriptionsActions.downloadPdfSuccess, (state) => ({ ...state, downloading: false })),
  on(PrescriptionsActions.downloadPdfFailure, (state, { error }) => ({
    ...state,
    downloading: false,
    error,
  })),

  on(PrescriptionsActions.clearError, (state) => ({ ...state, error: null })),
  on(PrescriptionsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);

function upsert(
  list: import('../../../core/models/prescription.model').Prescription[],
  prescription: import('../../../core/models/prescription.model').Prescription,
) {
  return list.some((p) => p.id === prescription.id)
    ? list.map((p) => (p.id === prescription.id ? prescription : p))
    : [prescription, ...list];
}
