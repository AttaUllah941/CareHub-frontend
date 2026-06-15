import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PHARMACY_FEATURE_KEY, PharmacyState } from './pharmacy.state';

export const selectPharmacyState = createFeatureSelector<PharmacyState>(PHARMACY_FEATURE_KEY);

export const selectMedicines = createSelector(selectPharmacyState, (s) => s.medicines);
export const selectMedicinesPagination = createSelector(selectPharmacyState, (s) => s.medicinesPagination);
export const selectMedicinesQuery = createSelector(selectPharmacyState, (s) => s.medicinesQuery);
export const selectInventory = createSelector(selectPharmacyState, (s) => s.inventory);
export const selectInventoryPagination = createSelector(selectPharmacyState, (s) => s.inventoryPagination);
export const selectPharmacyOrders = createSelector(selectPharmacyState, (s) => s.orders);
export const selectPharmacyOrdersPagination = createSelector(selectPharmacyState, (s) => s.ordersPagination);
export const selectMyPharmacyOrders = createSelector(selectPharmacyState, (s) => s.myOrders);
export const selectPrescriptionUploads = createSelector(selectPharmacyState, (s) => s.uploads);
export const selectMyPrescriptionUploads = createSelector(selectPharmacyState, (s) => s.myUploads);
export const selectPharmacyLoading = createSelector(selectPharmacyState, (s) => s.loading);
export const selectPharmacySaving = createSelector(selectPharmacyState, (s) => s.saving);
export const selectPharmacyError = createSelector(selectPharmacyState, (s) => s.error);
export const selectPharmacySuccessMessage = createSelector(selectPharmacyState, (s) => s.successMessage);
