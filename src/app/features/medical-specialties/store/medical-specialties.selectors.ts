import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MEDICAL_SPECIALTIES_FEATURE_KEY, MedicalSpecialtiesState } from './medical-specialties.state';

export const selectMedicalSpecialtiesState = createFeatureSelector<MedicalSpecialtiesState>(
  MEDICAL_SPECIALTIES_FEATURE_KEY,
);

export const selectSpecialties = createSelector(selectMedicalSpecialtiesState, (s) => s.specialties);
export const selectAllSpecialties = createSelector(selectMedicalSpecialtiesState, (s) => s.allSpecialties);
export const selectSelectedSpecialty = createSelector(selectMedicalSpecialtiesState, (s) => s.selectedSpecialty);
export const selectSpecialtiesPagination = createSelector(selectMedicalSpecialtiesState, (s) => s.pagination);
export const selectSpecialtiesQuery = createSelector(selectMedicalSpecialtiesState, (s) => s.query);
export const selectSpecialtiesLoading = createSelector(selectMedicalSpecialtiesState, (s) => s.loading);
export const selectSpecialtiesSaving = createSelector(selectMedicalSpecialtiesState, (s) => s.saving);
export const selectSpecialtiesError = createSelector(selectMedicalSpecialtiesState, (s) => s.error);
export const selectSpecialtiesSuccessMessage = createSelector(selectMedicalSpecialtiesState, (s) => s.successMessage);
