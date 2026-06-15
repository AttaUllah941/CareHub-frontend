import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LAB_FEATURE_KEY, LabState } from './lab.state';

export const selectLabState = createFeatureSelector<LabState>(LAB_FEATURE_KEY);
export const selectLabs = createSelector(selectLabState, (s) => s.labs);
export const selectLabTests = createSelector(selectLabState, (s) => s.tests);
export const selectLabBookings = createSelector(selectLabState, (s) => s.bookings);
export const selectMyLabBookings = createSelector(selectLabState, (s) => s.myBookings);
export const selectLabReports = createSelector(selectLabState, (s) => s.reports);
export const selectMyLabReports = createSelector(selectLabState, (s) => s.myReports);
export const selectLabLoading = createSelector(selectLabState, (s) => s.loading);
export const selectLabSaving = createSelector(selectLabState, (s) => s.saving);
export const selectLabError = createSelector(selectLabState, (s) => s.error);
export const selectLabSuccessMessage = createSelector(selectLabState, (s) => s.successMessage);
