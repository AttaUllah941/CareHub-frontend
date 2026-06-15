import { createReducer, on } from '@ngrx/store';
import { DEFAULT_MEDICAL_RECORD_LIST_QUERY } from '../../../core/models/medical-record.model';
import { MedicalRecord } from '../../../core/models/medical-record.model';
import { MedicalRecordsActions } from './medical-records.actions';
import { initialMedicalRecordsState } from './medical-records.state';

const setSaving = (state: typeof initialMedicalRecordsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialMedicalRecordsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  downloading: false,
  error,
});

export const medicalRecordsReducer = createReducer(
  initialMedicalRecordsState,

  on(MedicalRecordsActions.loadRecords, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_MEDICAL_RECORD_LIST_QUERY, ...state.query, ...query },
  })),
  on(MedicalRecordsActions.loadRecordsSuccess, (state, { records, pagination, query }) => ({
    ...state,
    records,
    pagination,
    query,
    loading: false,
  })),
  on(MedicalRecordsActions.loadRecordsFailure, setFailure),

  on(
    MedicalRecordsActions.loadMyRecords,
    MedicalRecordsActions.loadByPatient,
    MedicalRecordsActions.loadRecordById,
    MedicalRecordsActions.loadRecordHistory,
    (state) => ({ ...state, loading: true, error: null }),
  ),
  on(MedicalRecordsActions.loadMyRecordsSuccess, (state, { records }) => ({
    ...state,
    myRecords: records,
    loading: false,
  })),
  on(MedicalRecordsActions.loadByPatientSuccess, (state, { records }) => ({
    ...state,
    patientRecords: records,
    loading: false,
  })),
  on(MedicalRecordsActions.loadRecordByIdSuccess, (state, { record }) => ({
    ...state,
    selectedRecord: record,
    loading: false,
  })),
  on(MedicalRecordsActions.loadRecordHistorySuccess, (state, { history, currentVersion }) => ({
    ...state,
    recordHistory: history,
    currentVersion,
    loading: false,
  })),
  on(
    MedicalRecordsActions.loadMyRecordsFailure,
    MedicalRecordsActions.loadByPatientFailure,
    MedicalRecordsActions.loadRecordByIdFailure,
    MedicalRecordsActions.loadRecordHistoryFailure,
    setFailure,
  ),
  on(MedicalRecordsActions.clearSelectedRecord, (state) => ({
    ...state,
    selectedRecord: null,
    recordHistory: [],
    currentVersion: 1,
  })),

  on(
    MedicalRecordsActions.uploadRecord,
    MedicalRecordsActions.uploadNewVersion,
    MedicalRecordsActions.updateRecord,
    MedicalRecordsActions.deleteRecord,
    setSaving,
  ),
  on(MedicalRecordsActions.uploadRecordSuccess, (state, { record, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedRecord: record,
    myRecords: upsert(state.myRecords, record),
    patientRecords: upsert(state.patientRecords, record),
    records: upsert(state.records, record),
  })),
  on(MedicalRecordsActions.uploadNewVersionSuccess, (state, { record, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedRecord: record,
    myRecords: upsert(state.myRecords, record),
    patientRecords: upsert(state.patientRecords, record),
    records: upsert(state.records, record),
  })),
  on(MedicalRecordsActions.updateRecordSuccess, (state, { record, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedRecord: record,
    myRecords: upsert(state.myRecords, record),
    patientRecords: upsert(state.patientRecords, record),
    records: upsert(state.records, record),
  })),
  on(MedicalRecordsActions.deleteRecordSuccess, (state, { message, id }) => ({
    ...state,
    saving: false,
    successMessage: message,
    records: state.records.filter((r) => r.id !== id),
    myRecords: state.myRecords.filter((r) => r.id !== id),
    patientRecords: state.patientRecords.filter((r) => r.id !== id),
    selectedRecord: state.selectedRecord?.id === id ? null : state.selectedRecord,
  })),
  on(
    MedicalRecordsActions.uploadRecordFailure,
    MedicalRecordsActions.uploadNewVersionFailure,
    MedicalRecordsActions.updateRecordFailure,
    MedicalRecordsActions.deleteRecordFailure,
    setFailure,
  ),

  on(MedicalRecordsActions.downloadRecord, (state) => ({ ...state, downloading: true, error: null })),
  on(MedicalRecordsActions.downloadRecordSuccess, (state) => ({ ...state, downloading: false })),
  on(MedicalRecordsActions.downloadRecordFailure, (state, { error }) => ({
    ...state,
    downloading: false,
    error,
  })),

  on(MedicalRecordsActions.clearError, (state) => ({ ...state, error: null })),
  on(MedicalRecordsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);

function upsert(list: MedicalRecord[], record: MedicalRecord) {
  return list.some((r) => r.id === record.id)
    ? list.map((r) => (r.id === record.id ? record : r))
    : [record, ...list];
}
