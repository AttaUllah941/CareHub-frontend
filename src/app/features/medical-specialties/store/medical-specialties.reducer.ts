import { createReducer, on } from '@ngrx/store';
import { DEFAULT_MEDICAL_SPECIALTY_LIST_QUERY } from '../../../core/models/medical-specialty.model';
import { MedicalSpecialtiesActions } from './medical-specialties.actions';
import { initialMedicalSpecialtiesState } from './medical-specialties.state';

const setSaving = (state: typeof initialMedicalSpecialtiesState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialMedicalSpecialtiesState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const medicalSpecialtiesReducer = createReducer(
  initialMedicalSpecialtiesState,

  on(MedicalSpecialtiesActions.loadSpecialties, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_MEDICAL_SPECIALTY_LIST_QUERY, ...state.query, ...query },
  })),
  on(MedicalSpecialtiesActions.loadSpecialtiesSuccess, (state, { specialties, pagination, query }) => ({
    ...state,
    specialties,
    pagination,
    query,
    loading: false,
  })),
  on(MedicalSpecialtiesActions.loadSpecialtiesFailure, setFailure),

  on(MedicalSpecialtiesActions.loadAllSpecialties, (state) => ({ ...state, loading: true })),
  on(MedicalSpecialtiesActions.loadAllSpecialtiesSuccess, (state, { specialties }) => ({
    ...state,
    allSpecialties: specialties,
    loading: false,
  })),
  on(MedicalSpecialtiesActions.loadAllSpecialtiesFailure, setFailure),

  on(MedicalSpecialtiesActions.loadSpecialty, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedSpecialty: null,
  })),
  on(MedicalSpecialtiesActions.loadSpecialtySuccess, (state, { specialty }) => ({
    ...state,
    selectedSpecialty: specialty,
    loading: false,
  })),
  on(MedicalSpecialtiesActions.loadSpecialtyFailure, setFailure),

  on(
    MedicalSpecialtiesActions.createSpecialty,
    MedicalSpecialtiesActions.updateSpecialty,
    MedicalSpecialtiesActions.deleteSpecialty,
    setSaving,
  ),

  on(MedicalSpecialtiesActions.createSpecialtySuccess, MedicalSpecialtiesActions.updateSpecialtySuccess, (state, { specialty, message }) => ({
    ...state,
    selectedSpecialty: specialty,
    saving: false,
    successMessage: message,
    specialties: state.specialties.some((s) => s.id === specialty.id)
      ? state.specialties.map((s) => (s.id === specialty.id ? specialty : s))
      : state.specialties,
  })),

  on(MedicalSpecialtiesActions.deleteSpecialtySuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),

  on(
    MedicalSpecialtiesActions.createSpecialtyFailure,
    MedicalSpecialtiesActions.updateSpecialtyFailure,
    MedicalSpecialtiesActions.deleteSpecialtyFailure,
    setFailure,
  ),

  on(MedicalSpecialtiesActions.clearError, (state) => ({ ...state, error: null })),
  on(MedicalSpecialtiesActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
