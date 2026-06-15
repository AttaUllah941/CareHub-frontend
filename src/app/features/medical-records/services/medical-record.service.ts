import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  MedicalRecordListQuery,
  UpdateMedicalRecordRequest,
  UploadMedicalRecordRequest,
} from '../../../core/models/medical-record.model';
import { MedicalRecordsActions } from '../store/medical-records.actions';
import {
  selectMedicalRecordCurrentVersion,
  selectMedicalRecordHistory,
  selectMedicalRecords,
  selectMedicalRecordsDownloading,
  selectMedicalRecordsError,
  selectMedicalRecordsLoading,
  selectMedicalRecordsPagination,
  selectMedicalRecordsQuery,
  selectMedicalRecordsSaving,
  selectMedicalRecordsSuccessMessage,
  selectMyMedicalRecords,
  selectPatientMedicalRecords,
  selectSelectedMedicalRecord,
} from '../store/medical-records.selectors';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService {
  private readonly store = inject(Store);

  readonly records = this.store.selectSignal(selectMedicalRecords);
  readonly myRecords = this.store.selectSignal(selectMyMedicalRecords);
  readonly patientRecords = this.store.selectSignal(selectPatientMedicalRecords);
  readonly selectedRecord = this.store.selectSignal(selectSelectedMedicalRecord);
  readonly recordHistory = this.store.selectSignal(selectMedicalRecordHistory);
  readonly currentVersion = this.store.selectSignal(selectMedicalRecordCurrentVersion);
  readonly pagination = this.store.selectSignal(selectMedicalRecordsPagination);
  readonly query = this.store.selectSignal(selectMedicalRecordsQuery);
  readonly loading = this.store.selectSignal(selectMedicalRecordsLoading);
  readonly saving = this.store.selectSignal(selectMedicalRecordsSaving);
  readonly downloading = this.store.selectSignal(selectMedicalRecordsDownloading);
  readonly error = this.store.selectSignal(selectMedicalRecordsError);
  readonly successMessage = this.store.selectSignal(selectMedicalRecordsSuccessMessage);

  loadRecords(query?: Partial<MedicalRecordListQuery>): void {
    this.store.dispatch(MedicalRecordsActions.loadRecords({ query }));
  }

  loadMyRecords(recordType?: string): void {
    this.store.dispatch(MedicalRecordsActions.loadMyRecords({ recordType }));
  }

  loadByPatient(patientProfileId: string, recordType?: string): void {
    this.store.dispatch(MedicalRecordsActions.loadByPatient({ patientProfileId, recordType }));
  }

  loadRecordById(id: string): void {
    this.store.dispatch(MedicalRecordsActions.loadRecordById({ id }));
  }

  loadRecordHistory(id: string): void {
    this.store.dispatch(MedicalRecordsActions.loadRecordHistory({ id }));
  }

  uploadRecord(payload: UploadMedicalRecordRequest): void {
    this.store.dispatch(MedicalRecordsActions.uploadRecord({ payload }));
  }

  uploadNewVersion(id: string, file: File, changeNote?: string): void {
    this.store.dispatch(MedicalRecordsActions.uploadNewVersion({ id, file, changeNote }));
  }

  updateRecord(id: string, payload: UpdateMedicalRecordRequest): void {
    this.store.dispatch(MedicalRecordsActions.updateRecord({ id, payload }));
  }

  deleteRecord(id: string): void {
    this.store.dispatch(MedicalRecordsActions.deleteRecord({ id }));
  }

  downloadRecord(id: string, filename?: string, version?: number): void {
    this.store.dispatch(MedicalRecordsActions.downloadRecord({ id, filename, version }));
  }

  clearSelectedRecord(): void {
    this.store.dispatch(MedicalRecordsActions.clearSelectedRecord());
  }

  clearError(): void {
    this.store.dispatch(MedicalRecordsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(MedicalRecordsActions.clearSuccessMessage());
  }
}
