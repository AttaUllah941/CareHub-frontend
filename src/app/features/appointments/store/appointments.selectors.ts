import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APPOINTMENTS_FEATURE_KEY, AppointmentsState } from './appointments.state';

export const selectAppointmentsState = createFeatureSelector<AppointmentsState>(APPOINTMENTS_FEATURE_KEY);

export const selectAppointments = createSelector(selectAppointmentsState, (s) => s.appointments);
export const selectMyAppointments = createSelector(selectAppointmentsState, (s) => s.myAppointments);
export const selectDoctorAppointments = createSelector(selectAppointmentsState, (s) => s.doctorAppointments);
export const selectAvailableSlots = createSelector(selectAppointmentsState, (s) => s.availableSlots);
export const selectRecurringSlots = createSelector(selectAppointmentsState, (s) => s.recurringSlots);
export const selectAppointmentsPagination = createSelector(selectAppointmentsState, (s) => s.pagination);
export const selectAppointmentsQuery = createSelector(selectAppointmentsState, (s) => s.query);
export const selectAppointmentsLoading = createSelector(selectAppointmentsState, (s) => s.loading);
export const selectSlotsLoading = createSelector(selectAppointmentsState, (s) => s.slotsLoading);
export const selectAppointmentsSaving = createSelector(selectAppointmentsState, (s) => s.saving);
export const selectAppointmentsError = createSelector(selectAppointmentsState, (s) => s.error);
export const selectAppointmentsSuccessMessage = createSelector(selectAppointmentsState, (s) => s.successMessage);
