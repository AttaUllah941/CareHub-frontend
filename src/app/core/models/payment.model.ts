export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentGateway = 'JAZZCASH' | 'EASYPAISA';

export type AppointmentPaymentStatus =
  | 'UNPAID'
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'NOT_REQUIRED';

export type RefundStatus = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';

export interface PaymentRefund {
  id?: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason?: string;
  gatewayRefundId?: string;
  processedAt?: string | null;
  failureReason?: string;
  createdAt?: string;
}

export interface PaymentAppointmentSummary {
  id: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  paymentStatus?: AppointmentPaymentStatus;
  consultationFee?: number;
  currency?: string;
  doctor?: {
    id: string;
    title?: string;
    user?: { firstName?: string; lastName?: string };
  };
  clinic?: { id: string; name?: string };
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientProfileId: string;
  bookedByUserId: string;
  doctorProfileId: string;
  clinicId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  gatewayOrderId?: string;
  gatewayTransactionId?: string;
  redirectUrl?: string;
  paidAt?: string | null;
  failedAt?: string | null;
  failureReason?: string;
  refundAmount: number;
  refundedAt?: string | null;
  refundableAmount?: number;
  refunds: PaymentRefund[];
  appointment?: PaymentAppointmentSummary;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListQuery {
  page: number;
  limit: number;
  status: string;
  gateway: string;
  search: string;
  patientProfileId: string;
}

export interface InitiatePaymentRequest {
  gateway: PaymentGateway;
}

export interface RefundPaymentRequest {
  amount?: number;
  reason: string;
}

export const DEFAULT_PAYMENT_LIST_QUERY: PaymentListQuery = {
  page: 1,
  limit: 10,
  status: '',
  gateway: '',
  search: '',
  patientProfileId: '',
};

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SUCCEEDED', label: 'Succeeded' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUND_PENDING', label: 'Refund Pending' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'PARTIALLY_REFUNDED', label: 'Partially Refunded' },
];

export const PAYMENT_GATEWAY_OPTIONS: { value: PaymentGateway; label: string }[] = [
  { value: 'JAZZCASH', label: 'JazzCash' },
  { value: 'EASYPAISA', label: 'EasyPaisa' },
];

export function formatPaymentDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function formatAmount(amount: number, currency = 'PKR'): string {
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function paymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function paymentStatusClass(status: PaymentStatus): string {
  switch (status) {
    case 'SUCCEEDED':
      return 'bg-green-100 text-green-800';
    case 'FAILED':
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'PROCESSING':
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'REFUNDED':
    case 'PARTIALLY_REFUNDED':
    case 'REFUND_PENDING':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function gatewayLabel(gateway: PaymentGateway): string {
  return PAYMENT_GATEWAY_OPTIONS.find((o) => o.value === gateway)?.label ?? gateway;
}
