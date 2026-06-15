import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CONSULTATIONS_FEATURE_KEY, ConsultationsState } from './consultations.state';

export const selectConsultationsState =
  createFeatureSelector<ConsultationsState>(CONSULTATIONS_FEATURE_KEY);

export const selectConsultations = createSelector(selectConsultationsState, (s) => s.consultations);
export const selectMyConsultations = createSelector(selectConsultationsState, (s) => s.myConsultations);
export const selectDoctorConsultations = createSelector(selectConsultationsState, (s) => s.doctorConsultations);
export const selectSelectedConsultation = createSelector(selectConsultationsState, (s) => s.selectedConsultation);
export const selectConsultationsPagination = createSelector(selectConsultationsState, (s) => s.pagination);
export const selectConsultationsQuery = createSelector(selectConsultationsState, (s) => s.query);
export const selectConsultationsLoading = createSelector(selectConsultationsState, (s) => s.loading);
export const selectConsultationsSaving = createSelector(selectConsultationsState, (s) => s.saving);
export const selectConsultationsError = createSelector(selectConsultationsState, (s) => s.error);
export const selectConsultationsSuccessMessage = createSelector(
  selectConsultationsState,
  (s) => s.successMessage,
);
