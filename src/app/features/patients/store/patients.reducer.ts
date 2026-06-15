import { createReducer, on } from '@ngrx/store';
import { DEFAULT_PATIENT_LIST_QUERY } from '../../../core/models/patient.model';
import { PatientsActions } from './patients.actions';
import { initialPatientsState } from './patients.state';

const setSaving = (state: typeof initialPatientsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialPatientsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const patientsReducer = createReducer(
  initialPatientsState,

  on(PatientsActions.loadPatients, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_PATIENT_LIST_QUERY, ...state.query, ...query },
  })),
  on(PatientsActions.loadPatientsSuccess, (state, { patients, pagination, query }) => ({
    ...state,
    patients,
    pagination,
    query,
    loading: false,
  })),
  on(PatientsActions.loadPatientsFailure, setFailure),

  on(PatientsActions.loadPatient, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedPatient: null,
  })),
  on(PatientsActions.loadPatientSuccess, (state, { patient }) => ({
    ...state,
    selectedPatient: patient,
    loading: false,
  })),
  on(PatientsActions.loadPatientFailure, setFailure),

  on(PatientsActions.loadMyProfile, (state) => ({ ...state, loading: true, error: null })),
  on(PatientsActions.loadMyProfileSuccess, (state, { patient }) => ({
    ...state,
    myProfile: patient,
    loading: false,
  })),
  on(PatientsActions.loadMyProfileFailure, setFailure),

  on(
    PatientsActions.createPatient,
    PatientsActions.createMyProfile,
    PatientsActions.updatePatient,
    PatientsActions.updateMyProfile,
    PatientsActions.deletePatient,
    setSaving,
  ),

  on(
    PatientsActions.createPatientSuccess,
    PatientsActions.createMyProfileSuccess,
    PatientsActions.updatePatientSuccess,
    PatientsActions.updateMyProfileSuccess,
    (state, { patient, message }) => ({
      ...state,
      selectedPatient: patient,
      myProfile: state.myProfile?.id === patient.id || !state.myProfile ? patient : state.myProfile,
      saving: false,
      successMessage: message,
      patients: state.patients.some((p) => p.id === patient.id)
        ? state.patients.map((p) => (p.id === patient.id ? patient : p))
        : state.patients,
    }),
  ),

  on(PatientsActions.deletePatientSuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),

  on(
    PatientsActions.createPatientFailure,
    PatientsActions.createMyProfileFailure,
    PatientsActions.updatePatientFailure,
    PatientsActions.updateMyProfileFailure,
    PatientsActions.deletePatientFailure,
    setFailure,
  ),

  on(PatientsActions.clearError, (state) => ({ ...state, error: null })),
  on(PatientsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
