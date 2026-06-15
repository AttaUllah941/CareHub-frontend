import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_MEDICAL_RECORD_LIST_QUERY } from '../../../core/models/medical-record.model';
import { MedicalRecordApiService } from '../services/medical-record-api.service';
import { MedicalRecordsActions } from './medical-records.actions';
import { selectMedicalRecordsQuery } from './medical-records.selectors';

@Injectable()
export class MedicalRecordsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(MedicalRecordApiService);
  private readonly store = inject(Store);

  loadRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.loadRecords),
      withLatestFrom(this.store.select(selectMedicalRecordsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_MEDICAL_RECORD_LIST_QUERY, ...current, ...query };
        return this.api.getRecords(merged).pipe(
          map((res) =>
            MedicalRecordsActions.loadRecordsSuccess({
              records: res.data.records,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              MedicalRecordsActions.loadRecordsFailure({
                error: err.error?.message ?? 'Failed to load medical records',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadMyRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.loadMyRecords),
      exhaustMap(({ recordType }) =>
        this.api.getMyRecords(recordType).pipe(
          map((res) => MedicalRecordsActions.loadMyRecordsSuccess({ records: res.data.records })),
          catchError((err) =>
            of(
              MedicalRecordsActions.loadMyRecordsFailure({
                error: err.error?.message ?? 'Failed to load medical records',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadByPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.loadByPatient),
      exhaustMap(({ patientProfileId, recordType }) =>
        this.api.getByPatientId(patientProfileId, recordType).pipe(
          map((res) => MedicalRecordsActions.loadByPatientSuccess({ records: res.data.records })),
          catchError((err) =>
            of(
              MedicalRecordsActions.loadByPatientFailure({
                error: err.error?.message ?? 'Failed to load patient records',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadRecordById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.loadRecordById),
      exhaustMap(({ id }) =>
        this.api.getRecordById(id).pipe(
          map((res) => MedicalRecordsActions.loadRecordByIdSuccess({ record: res.data.record })),
          catchError((err) =>
            of(
              MedicalRecordsActions.loadRecordByIdFailure({
                error: err.error?.message ?? 'Record not found',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadRecordHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.loadRecordHistory),
      exhaustMap(({ id }) =>
        this.api.getRecordHistory(id).pipe(
          map((res) =>
            MedicalRecordsActions.loadRecordHistorySuccess({
              recordId: res.data.recordId,
              currentVersion: res.data.currentVersion,
              history: res.data.history ?? [],
            }),
          ),
          catchError((err) =>
            of(
              MedicalRecordsActions.loadRecordHistoryFailure({
                error: err.error?.message ?? 'Failed to load history',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  uploadRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.uploadRecord),
      exhaustMap(({ payload }) =>
        this.api.uploadRecord(payload).pipe(
          map((res) =>
            MedicalRecordsActions.uploadRecordSuccess({
              record: res.data.record,
              message: res.message ?? 'Record uploaded',
            }),
          ),
          catchError((err) =>
            of(
              MedicalRecordsActions.uploadRecordFailure({
                error: err.error?.message ?? 'Failed to upload record',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  uploadNewVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.uploadNewVersion),
      exhaustMap(({ id, file, changeNote }) =>
        this.api.uploadNewVersion(id, file, changeNote).pipe(
          map((res) =>
            MedicalRecordsActions.uploadNewVersionSuccess({
              record: res.data.record,
              message: res.message ?? 'New version uploaded',
            }),
          ),
          catchError((err) =>
            of(
              MedicalRecordsActions.uploadNewVersionFailure({
                error: err.error?.message ?? 'Failed to upload new version',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.updateRecord),
      exhaustMap(({ id, payload }) =>
        this.api.updateRecord(id, payload).pipe(
          map((res) =>
            MedicalRecordsActions.updateRecordSuccess({
              record: res.data.record,
              message: res.message ?? 'Record updated',
            }),
          ),
          catchError((err) =>
            of(
              MedicalRecordsActions.updateRecordFailure({
                error: err.error?.message ?? 'Failed to update record',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.deleteRecord),
      exhaustMap(({ id }) =>
        this.api.deleteRecord(id).pipe(
          map((res) =>
            MedicalRecordsActions.deleteRecordSuccess({
              message: res.message ?? 'Record removed',
              id,
            }),
          ),
          catchError((err) =>
            of(
              MedicalRecordsActions.deleteRecordFailure({
                error: err.error?.message ?? 'Failed to delete record',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  downloadRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicalRecordsActions.downloadRecord),
      exhaustMap(({ id, filename, version }) =>
        this.api.downloadRecord(id, version).pipe(
          tap((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename ?? `medical-record-${id}`;
            link.click();
            URL.revokeObjectURL(url);
          }),
          map(() => MedicalRecordsActions.downloadRecordSuccess()),
          catchError(() =>
            of(MedicalRecordsActions.downloadRecordFailure({ error: 'Failed to download file' })),
          ),
        ),
      ),
    ),
  );
}
