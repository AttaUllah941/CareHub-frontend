import { DEFAULT_PAYMENT_LIST_QUERY, Payment, PaymentListQuery } from '../../../core/models/payment.model';

export interface PaymentsState {
  payments: Payment[];
  myPayments: Payment[];
  selectedPayment: Payment | null;
  initiatedPayment: Payment | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: PaymentListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const PAYMENTS_FEATURE_KEY = 'payments';

export const initialPaymentsState: PaymentsState = {
  payments: [],
  myPayments: [],
  selectedPayment: null,
  initiatedPayment: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_PAYMENT_LIST_QUERY },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
