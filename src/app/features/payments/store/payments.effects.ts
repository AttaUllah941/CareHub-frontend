import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { DEFAULT_PAYMENT_LIST_QUERY } from '../../../core/models/payment.model';
import { PaymentApiService } from '../services/payment-api.service';
import { PaymentsActions } from './payments.actions';
import { selectPaymentsQuery } from './payments.selectors';

@Injectable()
export class PaymentsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PaymentApiService);
  private readonly store = inject(Store);

  loadPayments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.loadPayments),
      withLatestFrom(this.store.select(selectPaymentsQuery)),
      exhaustMap(([{ query }, current]) => {
        const merged = { ...DEFAULT_PAYMENT_LIST_QUERY, ...current, ...query };
        return this.api.getPayments(merged).pipe(
          map((res) =>
            PaymentsActions.loadPaymentsSuccess({
              payments: res.data.payments,
              pagination: res.data.pagination,
              query: merged,
            }),
          ),
          catchError((err) =>
            of(PaymentsActions.loadPaymentsFailure({ error: err.error?.message ?? 'Failed to load payments' })),
          ),
        );
      }),
    ),
  );

  loadMyPayments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.loadMyPayments),
      exhaustMap(({ query }) =>
        this.api.getMyPayments(query).pipe(
          map((res) =>
            PaymentsActions.loadMyPaymentsSuccess({
              payments: res.data.payments,
              pagination: res.data.pagination,
            }),
          ),
          catchError((err) =>
            of(PaymentsActions.loadMyPaymentsFailure({ error: err.error?.message ?? 'Failed to load payments' })),
          ),
        ),
      ),
    ),
  );

  loadByAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.loadByAppointment),
      exhaustMap(({ appointmentId }) =>
        this.api.getByAppointmentId(appointmentId).pipe(
          map((res) => PaymentsActions.loadByAppointmentSuccess({ payment: res.data.payment })),
          catchError((err) =>
            of(PaymentsActions.loadByAppointmentFailure({ error: err.error?.message ?? 'Payment not found' })),
          ),
        ),
      ),
    ),
  );

  loadPaymentById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.loadPaymentById),
      exhaustMap(({ id }) =>
        this.api.getPaymentById(id).pipe(
          map((res) => PaymentsActions.loadPaymentByIdSuccess({ payment: res.data.payment })),
          catchError((err) =>
            of(PaymentsActions.loadPaymentByIdFailure({ error: err.error?.message ?? 'Payment not found' })),
          ),
        ),
      ),
    ),
  );

  initiatePayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.initiatePayment),
      exhaustMap(({ appointmentId, payload }) =>
        this.api.initiatePayment(appointmentId, payload).pipe(
          map((res) =>
            PaymentsActions.initiatePaymentSuccess({
              payment: res.data.payment,
              message: res.message ?? 'Payment initiated',
            }),
          ),
          catchError((err) =>
            of(PaymentsActions.initiatePaymentFailure({ error: err.error?.message ?? 'Failed to initiate payment' })),
          ),
        ),
      ),
    ),
  );

  redirectAfterInitiate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaymentsActions.initiatePaymentSuccess),
        tap(({ payment }) => {
          if (payment.redirectUrl) {
            window.location.href = payment.redirectUrl;
          }
        }),
      ),
    { dispatch: false },
  );

  completeCallback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.completeCallback),
      exhaustMap(({ gateway, params }) =>
        this.api.completeCallback(gateway, params).pipe(
          map((res) =>
            PaymentsActions.completeCallbackSuccess({
              payment: res.data.payment,
              message: res.data.payment.status === 'SUCCEEDED' ? 'Payment successful' : 'Payment failed',
            }),
          ),
          catchError((err) =>
            of(PaymentsActions.completeCallbackFailure({ error: err.error?.message ?? 'Payment verification failed' })),
          ),
        ),
      ),
    ),
  );

  initiateRefund$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.initiateRefund),
      exhaustMap(({ id, payload }) =>
        this.api.initiateRefund(id, payload).pipe(
          map((res) =>
            PaymentsActions.initiateRefundSuccess({
              payment: res.data.payment,
              message: res.message ?? 'Refund initiated',
            }),
          ),
          catchError((err) =>
            of(PaymentsActions.initiateRefundFailure({ error: err.error?.message ?? 'Failed to process refund' })),
          ),
        ),
      ),
    ),
  );
}
