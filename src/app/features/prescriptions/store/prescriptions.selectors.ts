import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PRESCRIPTIONS_FEATURE_KEY, PrescriptionsState } from './prescriptions.state';

export const selectPrescriptionsState =
  createFeatureSelector<PrescriptionsState>(PRESCRIPTIONS_FEATURE_KEY);

export const selectPrescriptions = createSelector(selectPrescriptionsState, (s) => s.prescriptions);
export const selectMyPrescriptions = createSelector(selectPrescriptionsState, (s) => s.myPrescriptions);
export const selectDoctorPrescriptions = createSelector(selectPrescriptionsState, (s) => s.doctorPrescriptions);
export const selectSelectedPrescription = createSelector(selectPrescriptionsState, (s) => s.selectedPrescription);
export const selectPrescriptionsPagination = createSelector(selectPrescriptionsState, (s) => s.pagination);
export const selectPrescriptionsQuery = createSelector(selectPrescriptionsState, (s) => s.query);
export const selectPrescriptionsLoading = createSelector(selectPrescriptionsState, (s) => s.loading);
export const selectPrescriptionsSaving = createSelector(selectPrescriptionsState, (s) => s.saving);
export const selectPrescriptionsDownloading = createSelector(selectPrescriptionsState, (s) => s.downloading);
export const selectPrescriptionsError = createSelector(selectPrescriptionsState, (s) => s.error);
export const selectPrescriptionsSuccessMessage = createSelector(
  selectPrescriptionsState,
  (s) => s.successMessage,
);
