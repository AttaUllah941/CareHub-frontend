import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  InitiatePaymentRequest,
  PaymentGateway,
  PaymentListQuery,
  RefundPaymentRequest,
} from '../../../core/models/payment.model';
import { PaymentsActions } from '../store/payments.actions';
import {
  selectInitiatedPayment,
  selectMyPayments,
  selectPayments,
  selectPaymentsError,
  selectPaymentsLoading,
  selectPaymentsPagination,
  selectPaymentsQuery,
  selectPaymentsSaving,
  selectPaymentsSuccessMessage,
  selectSelectedPayment,
} from '../store/payments.selectors';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly store = inject(Store);

  readonly payments = this.store.selectSignal(selectPayments);
  readonly myPayments = this.store.selectSignal(selectMyPayments);
  readonly selectedPayment = this.store.selectSignal(selectSelectedPayment);
  readonly initiatedPayment = this.store.selectSignal(selectInitiatedPayment);
  readonly pagination = this.store.selectSignal(selectPaymentsPagination);
  readonly query = this.store.selectSignal(selectPaymentsQuery);
  readonly loading = this.store.selectSignal(selectPaymentsLoading);
  readonly saving = this.store.selectSignal(selectPaymentsSaving);
  readonly error = this.store.selectSignal(selectPaymentsError);
  readonly successMessage = this.store.selectSignal(selectPaymentsSuccessMessage);

  loadPayments(query?: Partial<PaymentListQuery>): void {
    this.store.dispatch(PaymentsActions.loadPayments({ query }));
  }

  loadMyPayments(query?: Partial<PaymentListQuery>): void {
    this.store.dispatch(PaymentsActions.loadMyPayments({ query }));
  }

  loadByAppointment(appointmentId: string): void {
    this.store.dispatch(PaymentsActions.loadByAppointment({ appointmentId }));
  }

  loadPaymentById(id: string): void {
    this.store.dispatch(PaymentsActions.loadPaymentById({ id }));
  }

  initiatePayment(appointmentId: string, payload: InitiatePaymentRequest): void {
    this.store.dispatch(PaymentsActions.initiatePayment({ appointmentId, payload }));
  }

  completeCallback(gateway: PaymentGateway, params: Record<string, string>): void {
    this.store.dispatch(PaymentsActions.completeCallback({ gateway, params }));
  }

  initiateRefund(id: string, payload: RefundPaymentRequest): void {
    this.store.dispatch(PaymentsActions.initiateRefund({ id, payload }));
  }

  clearSelectedPayment(): void {
    this.store.dispatch(PaymentsActions.clearSelectedPayment());
  }

  clearInitiatedPayment(): void {
    this.store.dispatch(PaymentsActions.clearInitiatedPayment());
  }

  clearError(): void {
    this.store.dispatch(PaymentsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(PaymentsActions.clearSuccessMessage());
  }
}
