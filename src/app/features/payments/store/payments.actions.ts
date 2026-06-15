import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  InitiatePaymentRequest,
  Payment,
  PaymentGateway,
  PaymentListQuery,
  RefundPaymentRequest,
} from '../../../core/models/payment.model';
import { PaginationMeta } from '../../../core/models/appointment.model';

export const PaymentsActions = createActionGroup({
  source: 'Payments',
  events: {
    'Load Payments': props<{ query?: Partial<PaymentListQuery> }>(),
    'Load Payments Success': props<{
      payments: Payment[];
      pagination: PaginationMeta;
      query: PaymentListQuery;
    }>(),
    'Load Payments Failure': props<{ error: string }>(),

    'Load My Payments': props<{ query?: Partial<PaymentListQuery> }>(),
    'Load My Payments Success': props<{ payments: Payment[]; pagination: PaginationMeta }>(),
    'Load My Payments Failure': props<{ error: string }>(),

    'Load By Appointment': props<{ appointmentId: string }>(),
    'Load By Appointment Success': props<{ payment: Payment }>(),
    'Load By Appointment Failure': props<{ error: string }>(),

    'Load Payment By Id': props<{ id: string }>(),
    'Load Payment By Id Success': props<{ payment: Payment }>(),
    'Load Payment By Id Failure': props<{ error: string }>(),

    'Initiate Payment': props<{ appointmentId: string; payload: InitiatePaymentRequest }>(),
    'Initiate Payment Success': props<{ payment: Payment; message: string }>(),
    'Initiate Payment Failure': props<{ error: string }>(),

    'Complete Callback': props<{ gateway: PaymentGateway; params: Record<string, string> }>(),
    'Complete Callback Success': props<{ payment: Payment; message: string }>(),
    'Complete Callback Failure': props<{ error: string }>(),

    'Initiate Refund': props<{ id: string; payload: RefundPaymentRequest }>(),
    'Initiate Refund Success': props<{ payment: Payment; message: string }>(),
    'Initiate Refund Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Selected Payment': emptyProps(),
    'Clear Initiated Payment': emptyProps(),
  },
});
