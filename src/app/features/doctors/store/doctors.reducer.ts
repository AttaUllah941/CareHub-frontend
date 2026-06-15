import { createReducer, on } from '@ngrx/store';
import { DEFAULT_DOCTOR_LIST_QUERY, DEFAULT_DOCTOR_SEARCH_QUERY } from '../../../core/models/doctor.model';
import { DoctorsActions } from './doctors.actions';
import { initialDoctorsState } from './doctors.state';

const setSaving = (state: typeof initialDoctorsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialDoctorsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const doctorsReducer = createReducer(
  initialDoctorsState,

  on(DoctorsActions.loadDoctors, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_DOCTOR_LIST_QUERY, ...state.query, ...query },
  })),
  on(DoctorsActions.loadDoctorsSuccess, (state, { doctors, pagination, query }) => ({
    ...state,
    doctors,
    pagination,
    query,
    loading: false,
  })),
  on(DoctorsActions.loadDoctorsFailure, setFailure),

  on(DoctorsActions.searchDoctors, (state, { query }) => ({
    ...state,
    searchLoading: true,
    error: null,
    searchQuery: { ...DEFAULT_DOCTOR_SEARCH_QUERY, ...state.searchQuery, ...query },
  })),
  on(DoctorsActions.searchDoctorsSuccess, (state, { doctors, pagination, query }) => ({
    ...state,
    searchResults: doctors,
    searchPagination: pagination,
    searchQuery: query,
    searchLoading: false,
  })),
  on(DoctorsActions.searchDoctorsFailure, (state, { error }) => ({
    ...state,
    searchLoading: false,
    error,
  })),

  on(DoctorsActions.loadDoctor, (state) => ({ ...state, loading: true, error: null, selectedDoctor: null })),
  on(DoctorsActions.loadDoctorSuccess, (state, { doctor }) => ({
    ...state,
    selectedDoctor: doctor,
    loading: false,
  })),
  on(DoctorsActions.loadDoctorFailure, setFailure),

  on(DoctorsActions.loadMyProfile, (state) => ({ ...state, loading: true, error: null })),
  on(DoctorsActions.loadMyProfileSuccess, (state, { doctor }) => ({
    ...state,
    myProfile: doctor,
    loading: false,
  })),
  on(DoctorsActions.loadMyProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    myProfile: null,
    error,
  })),

  on(
    DoctorsActions.createDoctor,
    DoctorsActions.createMyProfile,
    DoctorsActions.updateDoctor,
    DoctorsActions.updateMyProfile,
    DoctorsActions.verifyDoctor,
    DoctorsActions.deleteDoctor,
    setSaving,
  ),

  on(
    DoctorsActions.createDoctorSuccess,
    DoctorsActions.updateDoctorSuccess,
    DoctorsActions.verifyDoctorSuccess,
    (state, { doctor, message }) => ({
      ...state,
      selectedDoctor: doctor,
      saving: false,
      successMessage: message,
      doctors: state.doctors.some((d) => d.id === doctor.id)
        ? state.doctors.map((d) => (d.id === doctor.id ? doctor : d))
        : state.doctors,
    }),
  ),

  on(DoctorsActions.createMyProfileSuccess, DoctorsActions.updateMyProfileSuccess, (state, { doctor, message }) => ({
    ...state,
    myProfile: doctor,
    saving: false,
    successMessage: message,
  })),

  on(DoctorsActions.deleteDoctorSuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),

  on(
    DoctorsActions.createDoctorFailure,
    DoctorsActions.createMyProfileFailure,
    DoctorsActions.updateDoctorFailure,
    DoctorsActions.updateMyProfileFailure,
    DoctorsActions.verifyDoctorFailure,
    DoctorsActions.deleteDoctorFailure,
    setFailure,
  ),

  on(DoctorsActions.clearError, (state) => ({ ...state, error: null })),
  on(DoctorsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
  on(DoctorsActions.clearSelectedDoctor, (state) => ({ ...state, selectedDoctor: null })),
);
