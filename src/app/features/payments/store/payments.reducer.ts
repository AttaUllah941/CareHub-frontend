import { createReducer, on } from '@ngrx/store';
import { DEFAULT_PAYMENT_LIST_QUERY, Payment } from '../../../core/models/payment.model';
import { PaymentsActions } from './payments.actions';
import { initialPaymentsState } from './payments.state';

const setSaving = (state: typeof initialPaymentsState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialPaymentsState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const paymentsReducer = createReducer(
  initialPaymentsState,

  on(PaymentsActions.loadPayments, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_PAYMENT_LIST_QUERY, ...state.query, ...query },
  })),
  on(PaymentsActions.loadPaymentsSuccess, (state, { payments, pagination, query }) => ({
    ...state,
    payments,
    pagination,
    query,
    loading: false,
  })),
  on(PaymentsActions.loadPaymentsFailure, setFailure),

  on(PaymentsActions.loadMyPayments, (state) => ({ ...state, loading: true, error: null })),
  on(PaymentsActions.loadMyPaymentsSuccess, (state, { payments, pagination }) => ({
    ...state,
    myPayments: payments,
    pagination,
    loading: false,
  })),
  on(PaymentsActions.loadMyPaymentsFailure, setFailure),

  on(
    PaymentsActions.loadByAppointment,
    PaymentsActions.loadPaymentById,
    (state) => ({ ...state, loading: true, error: null }),
  ),
  on(PaymentsActions.loadByAppointmentSuccess, PaymentsActions.loadPaymentByIdSuccess, (state, { payment }) => ({
    ...state,
    selectedPayment: payment,
    loading: false,
  })),
  on(
    PaymentsActions.loadByAppointmentFailure,
    PaymentsActions.loadPaymentByIdFailure,
    setFailure,
  ),

  on(PaymentsActions.initiatePayment, PaymentsActions.initiateRefund, setSaving),
  on(PaymentsActions.initiatePaymentSuccess, (state, { payment, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    initiatedPayment: payment,
    myPayments: upsert(state.myPayments, payment),
  })),
  on(PaymentsActions.initiateRefundSuccess, (state, { payment, message }) => ({
    ...state,
    saving: false,
    successMessage: message,
    selectedPayment: payment,
    payments: upsert(state.payments, payment),
    myPayments: upsert(state.myPayments, payment),
  })),
  on(PaymentsActions.initiatePaymentFailure, PaymentsActions.initiateRefundFailure, setFailure),

  on(PaymentsActions.completeCallback, (state) => ({ ...state, loading: true, error: null })),
  on(PaymentsActions.completeCallbackSuccess, (state, { payment, message }) => ({
    ...state,
    loading: false,
    successMessage: message,
    selectedPayment: payment,
    initiatedPayment: null,
    myPayments: upsert(state.myPayments, payment),
  })),
  on(PaymentsActions.completeCallbackFailure, setFailure),

  on(PaymentsActions.clearSelectedPayment, (state) => ({ ...state, selectedPayment: null })),
  on(PaymentsActions.clearInitiatedPayment, (state) => ({ ...state, initiatedPayment: null })),
  on(PaymentsActions.clearError, (state) => ({ ...state, error: null })),
  on(PaymentsActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);

function upsert(list: Payment[], payment: Payment) {
  return list.some((p) => p.id === payment.id)
    ? list.map((p) => (p.id === payment.id ? payment : p))
    : [payment, ...list];
}
