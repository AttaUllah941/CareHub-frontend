import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PATIENTS_FEATURE_KEY, PatientsState } from './patients.state';

export const selectPatientsState = createFeatureSelector<PatientsState>(PATIENTS_FEATURE_KEY);

export const selectPatients = createSelector(selectPatientsState, (s) => s.patients);
export const selectSelectedPatient = createSelector(selectPatientsState, (s) => s.selectedPatient);
export const selectMyPatientProfile = createSelector(selectPatientsState, (s) => s.myProfile);
export const selectPatientsPagination = createSelector(selectPatientsState, (s) => s.pagination);
export const selectPatientsQuery = createSelector(selectPatientsState, (s) => s.query);
export const selectPatientsLoading = createSelector(selectPatientsState, (s) => s.loading);
export const selectPatientsSaving = createSelector(selectPatientsState, (s) => s.saving);
export const selectPatientsError = createSelector(selectPatientsState, (s) => s.error);
export const selectPatientsSuccessMessage = createSelector(selectPatientsState, (s) => s.successMessage);
