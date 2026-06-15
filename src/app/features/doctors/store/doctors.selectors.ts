import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DOCTORS_FEATURE_KEY, DoctorsState } from './doctors.state';

export const selectDoctorsState = createFeatureSelector<DoctorsState>(DOCTORS_FEATURE_KEY);

export const selectDoctors = createSelector(selectDoctorsState, (s) => s.doctors);
export const selectSelectedDoctor = createSelector(selectDoctorsState, (s) => s.selectedDoctor);
export const selectMyDoctorProfile = createSelector(selectDoctorsState, (s) => s.myProfile);
export const selectDoctorsPagination = createSelector(selectDoctorsState, (s) => s.pagination);
export const selectDoctorsQuery = createSelector(selectDoctorsState, (s) => s.query);
export const selectDoctorsLoading = createSelector(selectDoctorsState, (s) => s.loading);
export const selectDoctorsSaving = createSelector(selectDoctorsState, (s) => s.saving);
export const selectDoctorsError = createSelector(selectDoctorsState, (s) => s.error);
export const selectDoctorsSuccessMessage = createSelector(selectDoctorsState, (s) => s.successMessage);

export const selectSearchResults = createSelector(selectDoctorsState, (s) => s.searchResults);
export const selectSearchPagination = createSelector(selectDoctorsState, (s) => s.searchPagination);
export const selectSearchQuery = createSelector(selectDoctorsState, (s) => s.searchQuery);
export const selectSearchLoading = createSelector(selectDoctorsState, (s) => s.searchLoading);
