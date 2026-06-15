import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CLINICS_FEATURE_KEY, ClinicsState } from './clinics.state';

export const selectClinicsState = createFeatureSelector<ClinicsState>(CLINICS_FEATURE_KEY);

export const selectClinics = createSelector(selectClinicsState, (s) => s.clinics);
export const selectAllClinics = createSelector(selectClinicsState, (s) => s.allClinics);
export const selectSelectedClinic = createSelector(selectClinicsState, (s) => s.selectedClinic);
export const selectMyClinic = createSelector(selectClinicsState, (s) => s.myClinic);
export const selectClinicsPagination = createSelector(selectClinicsState, (s) => s.pagination);
export const selectClinicsQuery = createSelector(selectClinicsState, (s) => s.query);
export const selectClinicsLoading = createSelector(selectClinicsState, (s) => s.loading);
export const selectClinicsSaving = createSelector(selectClinicsState, (s) => s.saving);
export const selectClinicsError = createSelector(selectClinicsState, (s) => s.error);
export const selectClinicsSuccessMessage = createSelector(selectClinicsState, (s) => s.successMessage);
