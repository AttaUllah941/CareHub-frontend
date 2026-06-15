import { createReducer, on } from '@ngrx/store';
import { DoctorAvailabilityActions } from './doctor-availability.actions';
import { initialDoctorAvailabilityState } from './doctor-availability.state';

export const doctorAvailabilityReducer = createReducer(
  initialDoctorAvailabilityState,

  on(DoctorAvailabilityActions.loadAvailability, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DoctorAvailabilityActions.loadAvailabilitySuccess, (state, { availability }) => ({
    ...state,
    availability,
    loading: false,
  })),
  on(DoctorAvailabilityActions.loadAvailabilityFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(DoctorAvailabilityActions.updateAvailability, (state) => ({
    ...state,
    saving: true,
    error: null,
    successMessage: null,
  })),
  on(DoctorAvailabilityActions.updateAvailabilitySuccess, (state, { availability, message }) => ({
    ...state,
    availability,
    saving: false,
    successMessage: message,
  })),
  on(DoctorAvailabilityActions.updateAvailabilityFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(DoctorAvailabilityActions.loadSlotsPreview, (state, { date }) => ({
    ...state,
    previewDate: date,
    loading: true,
  })),
  on(DoctorAvailabilityActions.loadSlotsPreviewSuccess, (state, response) => ({
    ...state,
    previewSlots: response.slots,
    previewSlotDuration: response.slotDurationMinutes,
    previewDate: response.date,
    loading: false,
  })),
  on(DoctorAvailabilityActions.loadSlotsPreviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(DoctorAvailabilityActions.clearError, (state) => ({ ...state, error: null })),
  on(DoctorAvailabilityActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
