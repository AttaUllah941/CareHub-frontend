import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_MEDICINE_LIST_QUERY } from '../../../core/models/pharmacy.model';
import { PharmacyApiService } from '../services/pharmacy-api.service';
import { PharmacyActions } from './pharmacy.actions';
import { selectMedicinesQuery } from './pharmacy.selectors';

@Injectable()
export class PharmacyEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PharmacyApiService);
  private readonly store = inject(Store);

  loadMedicines$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadMedicines),
      withLatestFrom(this.store.select(selectMedicinesQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_MEDICINE_LIST_QUERY, ...current, ...query };
        return this.api.getMedicines(merged).pipe(
          map((res) =>
            PharmacyActions.loadMedicinesSuccess({
              medicines: res.data.medicines,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(PharmacyActions.loadMedicinesFailure({ error: err.error?.message ?? 'Failed to load medicines' })),
          ),
        );
      }),
    ),
  );

  createMedicine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.createMedicine),
      exhaustMap(({ payload }) =>
        this.api.createMedicine(payload).pipe(
          map((res) =>
            PharmacyActions.createMedicineSuccess({ medicine: res.data.medicine, message: res.message ?? 'Medicine created' }),
          ),
          tap(() => this.store.dispatch(PharmacyActions.loadMedicines({}))),
          catchError((err) =>
            of(PharmacyActions.createMedicineFailure({ error: err.error?.message ?? 'Failed to create medicine' })),
          ),
        ),
      ),
    ),
  );

  loadInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadInventory),
      exhaustMap(({ query }) =>
        this.api.getInventory(query).pipe(
          map((res) =>
            PharmacyActions.loadInventorySuccess({ inventory: res.data.inventory, pagination: res.data.pagination }),
          ),
          catchError((err) =>
            of(PharmacyActions.loadInventoryFailure({ error: err.error?.message ?? 'Failed to load inventory' })),
          ),
        ),
      ),
    ),
  );

  upsertInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.upsertInventory),
      exhaustMap(({ payload }) =>
        this.api.upsertInventory(payload).pipe(
          map((res) =>
            PharmacyActions.upsertInventorySuccess({
              inventory: res.data.inventory,
              message: res.message ?? 'Inventory saved',
            }),
          ),
          tap(() => this.store.dispatch(PharmacyActions.loadInventory({}))),
          catchError((err) =>
            of(PharmacyActions.upsertInventoryFailure({ error: err.error?.message ?? 'Failed to save inventory' })),
          ),
        ),
      ),
    ),
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadOrders),
      exhaustMap(({ query }) =>
        this.api.getOrders(query).pipe(
          map((res) =>
            PharmacyActions.loadOrdersSuccess({ orders: res.data.orders, pagination: res.data.pagination }),
          ),
          catchError((err) =>
            of(PharmacyActions.loadOrdersFailure({ error: err.error?.message ?? 'Failed to load orders' })),
          ),
        ),
      ),
    ),
  );

  loadMyOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadMyOrders),
      exhaustMap(() =>
        this.api.getMyOrders().pipe(
          map((res) => PharmacyActions.loadMyOrdersSuccess({ orders: res.data.orders })),
          catchError((err) =>
            of(PharmacyActions.loadMyOrdersFailure({ error: err.error?.message ?? 'Failed to load orders' })),
          ),
        ),
      ),
    ),
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.createOrder),
      exhaustMap(({ payload }) =>
        this.api.createOrder(payload).pipe(
          map((res) =>
            PharmacyActions.createOrderSuccess({ order: res.data.order, message: res.message ?? 'Order placed' }),
          ),
          catchError((err) =>
            of(PharmacyActions.createOrderFailure({ error: err.error?.message ?? 'Failed to place order' })),
          ),
        ),
      ),
    ),
  );

  createOrderFromPrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.createOrderFromPrescription),
      exhaustMap(({ prescriptionId, payload }) =>
        this.api.createOrderFromPrescription(prescriptionId, payload).pipe(
          map((res) =>
            PharmacyActions.createOrderFromPrescriptionSuccess({
              order: res.data.order,
              message: res.message ?? 'Order placed from prescription',
            }),
          ),
          catchError((err) =>
            of(
              PharmacyActions.createOrderFromPrescriptionFailure({
                error: err.error?.message ?? 'Failed to place order',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.updateOrderStatus),
      exhaustMap(({ id, status, notes }) =>
        this.api.updateOrderStatus(id, { status, notes }).pipe(
          map((res) =>
            PharmacyActions.updateOrderStatusSuccess({
              order: res.data.order,
              message: res.message ?? 'Order updated',
            }),
          ),
          catchError((err) =>
            of(PharmacyActions.updateOrderStatusFailure({ error: err.error?.message ?? 'Failed to update order' })),
          ),
        ),
      ),
    ),
  );

  loadMyUploads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadMyUploads),
      exhaustMap(() =>
        this.api.getMyPrescriptionUploads().pipe(
          map((res) => PharmacyActions.loadMyUploadsSuccess({ uploads: res.data.uploads })),
          catchError((err) =>
            of(PharmacyActions.loadMyUploadsFailure({ error: err.error?.message ?? 'Failed to load uploads' })),
          ),
        ),
      ),
    ),
  );

  loadUploads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.loadUploads),
      exhaustMap(({ query }) =>
        this.api.getPrescriptionUploads(query).pipe(
          map((res) =>
            PharmacyActions.loadUploadsSuccess({ uploads: res.data.uploads, pagination: res.data.pagination }),
          ),
          catchError((err) =>
            of(PharmacyActions.loadUploadsFailure({ error: err.error?.message ?? 'Failed to load uploads' })),
          ),
        ),
      ),
    ),
  );

  uploadPrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.uploadPrescription),
      exhaustMap(({ file, title }) =>
        this.api.uploadPrescription(file, title).pipe(
          map((res) =>
            PharmacyActions.uploadPrescriptionSuccess({
              upload: res.data.upload,
              message: res.message ?? 'Prescription uploaded',
            }),
          ),
          catchError((err) =>
            of(PharmacyActions.uploadPrescriptionFailure({ error: err.error?.message ?? 'Upload failed' })),
          ),
        ),
      ),
    ),
  );

  reviewUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PharmacyActions.reviewUpload),
      exhaustMap(({ id, status, reviewNotes }) =>
        this.api.reviewPrescriptionUpload(id, { status, reviewNotes }).pipe(
          map((res) =>
            PharmacyActions.reviewUploadSuccess({
              upload: res.data.upload,
              message: res.message ?? 'Upload reviewed',
            }),
          ),
          catchError((err) =>
            of(PharmacyActions.reviewUploadFailure({ error: err.error?.message ?? 'Review failed' })),
          ),
        ),
      ),
    ),
  );
}
