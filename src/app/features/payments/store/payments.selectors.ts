import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PAYMENTS_FEATURE_KEY, PaymentsState } from './payments.state';

export const selectPaymentsState = createFeatureSelector<PaymentsState>(PAYMENTS_FEATURE_KEY);

export const selectPayments = createSelector(selectPaymentsState, (s) => s.payments);
export const selectMyPayments = createSelector(selectPaymentsState, (s) => s.myPayments);
export const selectSelectedPayment = createSelector(selectPaymentsState, (s) => s.selectedPayment);
export const selectInitiatedPayment = createSelector(selectPaymentsState, (s) => s.initiatedPayment);
export const selectPaymentsPagination = createSelector(selectPaymentsState, (s) => s.pagination);
export const selectPaymentsQuery = createSelector(selectPaymentsState, (s) => s.query);
export const selectPaymentsLoading = createSelector(selectPaymentsState, (s) => s.loading);
export const selectPaymentsSaving = createSelector(selectPaymentsState, (s) => s.saving);
export const selectPaymentsError = createSelector(selectPaymentsState, (s) => s.error);
export const selectPaymentsSuccessMessage = createSelector(selectPaymentsState, (s) => s.successMessage);
