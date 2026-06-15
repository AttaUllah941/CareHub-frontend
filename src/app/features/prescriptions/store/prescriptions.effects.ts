import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_PRESCRIPTION_LIST_QUERY } from '../../../core/models/prescription.model';
import { PrescriptionApiService } from '../services/prescription-api.service';
import { PrescriptionsActions } from './prescriptions.actions';
import { selectPrescriptionsQuery } from './prescriptions.selectors';

@Injectable()
export class PrescriptionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PrescriptionApiService);
  private readonly store = inject(Store);

  loadPrescriptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.loadPrescriptions),
      withLatestFrom(this.store.select(selectPrescriptionsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_PRESCRIPTION_LIST_QUERY, ...current, ...query };
        return this.api.getPrescriptions(merged).pipe(
          map((res) =>
            PrescriptionsActions.loadPrescriptionsSuccess({
              prescriptions: res.data.prescriptions,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(
              PrescriptionsActions.loadPrescriptionsFailure({
                error: err.error?.message ?? 'Failed to load prescriptions',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadMyPrescriptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.loadMyPrescriptions),
      exhaustMap(() =>
        this.api.getMyPrescriptions().pipe(
          map((res) =>
            PrescriptionsActions.loadMyPrescriptionsSuccess({ prescriptions: res.data.prescriptions }),
          ),
          catchError((err) =>
            of(
              PrescriptionsActions.loadMyPrescriptionsFailure({
                error: err.error?.message ?? 'Failed to load prescriptions',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadDoctorPrescriptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.loadDoctorPrescriptions),
      exhaustMap(() =>
        this.api.getDoctorPrescriptions().pipe(
          map((res) =>
            PrescriptionsActions.loadDoctorPrescriptionsSuccess({
              prescriptions: res.data.prescriptions,
            }),
          ),
          catchError((err) =>
            of(
              PrescriptionsActions.loadDoctorPrescriptionsFailure({
                error: err.error?.message ?? 'Failed to load prescriptions',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadByConsultation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.loadByConsultation),
      exhaustMap(({ consultationId }) =>
        this.api.getByConsultationId(consultationId).pipe(
          map((res) => PrescriptionsActions.loadByConsultationSuccess({ prescription: res.data.prescription })),
          catchError((err) =>
            of(
              PrescriptionsActions.loadByConsultationFailure({
                error: err.error?.message ?? 'Prescription not found',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createPrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.createPrescription),
      exhaustMap(({ consultationId, payload }) =>
        this.api.createForConsultation(consultationId, payload).pipe(
          map((res) =>
            PrescriptionsActions.createPrescriptionSuccess({
              prescription: res.data.prescription,
              message: res.message ?? 'Prescription created',
            }),
          ),
          catchError((err) =>
            of(
              PrescriptionsActions.createPrescriptionFailure({
                error: err.error?.message ?? 'Failed to create prescription',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updatePrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.updatePrescription),
      exhaustMap(({ id, payload }) =>
        this.api.updatePrescription(id, payload).pipe(
          map((res) =>
            PrescriptionsActions.updatePrescriptionSuccess({
              prescription: res.data.prescription,
              message: res.message ?? 'Prescription updated',
            }),
          ),
          catchError((err) =>
            of(
              PrescriptionsActions.updatePrescriptionFailure({
                error: err.error?.message ?? 'Failed to update prescription',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deletePrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.deletePrescription),
      exhaustMap(({ id }) =>
        this.api.deletePrescription(id).pipe(
          map((res) =>
            PrescriptionsActions.deletePrescriptionSuccess({
              message: res.message ?? 'Prescription removed',
              id,
            }),
          ),
          catchError((err) =>
            of(
              PrescriptionsActions.deletePrescriptionFailure({
                error: err.error?.message ?? 'Failed to delete prescription',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  downloadPdf$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.downloadPdf),
      exhaustMap(({ id, filename }) =>
        this.api.downloadPdf(id).pipe(
          tap((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename ?? `prescription-${id}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
          }),
          map(() => PrescriptionsActions.downloadPdfSuccess()),
          catchError(() =>
            of(PrescriptionsActions.downloadPdfFailure({ error: 'Failed to download PDF' })),
          ),
        ),
      ),
    ),
  );
}
