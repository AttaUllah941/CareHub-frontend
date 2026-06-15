import { createReducer, on } from '@ngrx/store';
import { DEFAULT_CLINIC_LIST_QUERY } from '../../../core/models/clinic.model';
import { ClinicsActions } from './clinics.actions';
import { initialClinicsState } from './clinics.state';

const setSaving = (state: typeof initialClinicsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialClinicsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const clinicsReducer = createReducer(
  initialClinicsState,

  on(ClinicsActions.loadClinics, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_CLINIC_LIST_QUERY, ...state.query, ...query },
  })),
  on(ClinicsActions.loadClinicsSuccess, (state, { clinics, pagination, query }) => ({
    ...state,
    clinics,
    pagination,
    query,
    loading: false,
  })),
  on(ClinicsActions.loadClinicsFailure, setFailure),

  on(ClinicsActions.loadAllClinics, (state) => ({ ...state, loading: true })),
  on(ClinicsActions.loadAllClinicsSuccess, (state, { clinics }) => ({
    ...state,
    allClinics: clinics,
    loading: false,
  })),
  on(ClinicsActions.loadAllClinicsFailure, setFailure),

  on(ClinicsActions.loadClinic, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedClinic: null,
  })),
  on(ClinicsActions.loadClinicSuccess, (state, { clinic }) => ({
    ...state,
    selectedClinic: clinic,
    loading: false,
  })),
  on(ClinicsActions.loadClinicFailure, setFailure),

  on(ClinicsActions.loadMyClinic, (state) => ({ ...state, loading: true, error: null })),
  on(ClinicsActions.loadMyClinicSuccess, (state, { clinic }) => ({
    ...state,
    myClinic: clinic,
    selectedClinic: clinic,
    loading: false,
  })),
  on(ClinicsActions.loadMyClinicFailure, setFailure),

  on(
    ClinicsActions.createClinic,
    ClinicsActions.updateClinic,
    ClinicsActions.updateMyClinic,
    ClinicsActions.assignDoctors,
    ClinicsActions.deleteClinic,
    setSaving,
  ),

  on(
    ClinicsActions.createClinicSuccess,
    ClinicsActions.updateClinicSuccess,
    ClinicsActions.updateMyClinicSuccess,
    ClinicsActions.assignDoctorsSuccess,
    (state, { clinic, message }) => ({
      ...state,
      selectedClinic: clinic,
      myClinic: state.myClinic?.id === clinic.id ? clinic : state.myClinic,
      saving: false,
      successMessage: message,
      clinics: state.clinics.some((c) => c.id === clinic.id)
        ? state.clinics.map((c) => (c.id === clinic.id ? clinic : c))
        : state.clinics,
    }),
  ),

  on(ClinicsActions.deleteClinicSuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),

  on(
    ClinicsActions.createClinicFailure,
    ClinicsActions.updateClinicFailure,
    ClinicsActions.updateMyClinicFailure,
    ClinicsActions.assignDoctorsFailure,
    ClinicsActions.deleteClinicFailure,
    setFailure,
  ),

  on(ClinicsActions.clearError, (state) => ({ ...state, error: null })),
  on(ClinicsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
