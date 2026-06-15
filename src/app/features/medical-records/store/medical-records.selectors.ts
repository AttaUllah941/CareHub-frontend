import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MEDICAL_RECORDS_FEATURE_KEY, MedicalRecordsState } from './medical-records.state';

export const selectMedicalRecordsState = createFeatureSelector<MedicalRecordsState>(MEDICAL_RECORDS_FEATURE_KEY);

export const selectMedicalRecords = createSelector(selectMedicalRecordsState, (s) => s.records);
export const selectMyMedicalRecords = createSelector(selectMedicalRecordsState, (s) => s.myRecords);
export const selectPatientMedicalRecords = createSelector(selectMedicalRecordsState, (s) => s.patientRecords);
export const selectSelectedMedicalRecord = createSelector(selectMedicalRecordsState, (s) => s.selectedRecord);
export const selectMedicalRecordHistory = createSelector(selectMedicalRecordsState, (s) => s.recordHistory);
export const selectMedicalRecordCurrentVersion = createSelector(selectMedicalRecordsState, (s) => s.currentVersion);
export const selectMedicalRecordsPagination = createSelector(selectMedicalRecordsState, (s) => s.pagination);
export const selectMedicalRecordsQuery = createSelector(selectMedicalRecordsState, (s) => s.query);
export const selectMedicalRecordsLoading = createSelector(selectMedicalRecordsState, (s) => s.loading);
export const selectMedicalRecordsSaving = createSelector(selectMedicalRecordsState, (s) => s.saving);
export const selectMedicalRecordsDownloading = createSelector(selectMedicalRecordsState, (s) => s.downloading);
export const selectMedicalRecordsError = createSelector(selectMedicalRecordsState, (s) => s.error);
export const selectMedicalRecordsSuccessMessage = createSelector(selectMedicalRecordsState, (s) => s.successMessage);
