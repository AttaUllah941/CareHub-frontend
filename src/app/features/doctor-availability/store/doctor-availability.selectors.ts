import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DOCTOR_AVAILABILITY_FEATURE_KEY, DoctorAvailabilityState } from './doctor-availability.state';

export const selectDoctorAvailabilityState = createFeatureSelector<DoctorAvailabilityState>(
  DOCTOR_AVAILABILITY_FEATURE_KEY,
);

export const selectAvailability = createSelector(selectDoctorAvailabilityState, (s) => s.availability);
export const selectPreviewSlots = createSelector(selectDoctorAvailabilityState, (s) => s.previewSlots);
export const selectPreviewDate = createSelector(selectDoctorAvailabilityState, (s) => s.previewDate);
export const selectAvailabilityLoading = createSelector(selectDoctorAvailabilityState, (s) => s.loading);
export const selectAvailabilitySaving = createSelector(selectDoctorAvailabilityState, (s) => s.saving);
export const selectAvailabilityError = createSelector(selectDoctorAvailabilityState, (s) => s.error);
export const selectAvailabilitySuccessMessage = createSelector(
  selectDoctorAvailabilityState,
  (s) => s.successMessage,
);
