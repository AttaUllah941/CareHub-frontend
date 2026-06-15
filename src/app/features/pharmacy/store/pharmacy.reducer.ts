import { createFeature, createReducer, on } from '@ngrx/store';
import { PharmacyActions } from './pharmacy.actions';
import { initialState } from './pharmacy.state';

export const pharmacyReducer = createReducer(
  initialState,
  on(PharmacyActions.loadMedicines, (state) => ({ ...state, loading: true, error: null })),
  on(PharmacyActions.loadMedicinesSuccess, (state, { medicines, pagination, query }) => ({
    ...state,
    loading: false,
    medicines,
    medicinesPagination: pagination,
    medicinesQuery: query,
  })),
  on(PharmacyActions.loadMedicinesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PharmacyActions.createMedicine, (state) => ({ ...state, saving: true, error: null })),
  on(PharmacyActions.createMedicineSuccess, (state, { medicine, message }) => ({
    ...state,
    saving: false,
    medicines: [medicine, ...state.medicines],
    successMessage: message,
  })),
  on(PharmacyActions.createMedicineFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PharmacyActions.loadInventory, (state) => ({ ...state, loading: true, error: null })),
  on(PharmacyActions.loadInventorySuccess, (state, { inventory, pagination }) => ({
    ...state,
    loading: false,
    inventory,
    inventoryPagination: pagination,
  })),
  on(PharmacyActions.loadInventoryFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PharmacyActions.upsertInventory, (state) => ({ ...state, saving: true, error: null })),
  on(PharmacyActions.upsertInventorySuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),
  on(PharmacyActions.upsertInventoryFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PharmacyActions.loadOrders, (state) => ({ ...state, loading: true, error: null })),
  on(PharmacyActions.loadOrdersSuccess, (state, { orders, pagination }) => ({
    ...state,
    loading: false,
    orders,
    ordersPagination: pagination,
  })),
  on(PharmacyActions.loadOrdersFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PharmacyActions.loadMyOrders, (state) => ({ ...state, loading: true, error: null })),
  on(PharmacyActions.loadMyOrdersSuccess, (state, { orders }) => ({ ...state, loading: false, myOrders: orders })),
  on(PharmacyActions.loadMyOrdersFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PharmacyActions.createOrder, PharmacyActions.createOrderFromPrescription, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(PharmacyActions.createOrderSuccess, PharmacyActions.createOrderFromPrescriptionSuccess, (state, { order, message }) => ({
    ...state,
    saving: false,
    myOrders: [order, ...state.myOrders],
    successMessage: message,
  })),
  on(PharmacyActions.createOrderFailure, PharmacyActions.createOrderFromPrescriptionFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(PharmacyActions.updateOrderStatus, (state) => ({ ...state, saving: true, error: null })),
  on(PharmacyActions.updateOrderStatusSuccess, (state, { order, message }) => ({
    ...state,
    saving: false,
    orders: state.orders.map((o) => (o.id === order.id ? order : o)),
    successMessage: message,
  })),
  on(PharmacyActions.updateOrderStatusFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PharmacyActions.loadMyUploads, (state) => ({ ...state, loading: true, error: null })),
  on(PharmacyActions.loadMyUploadsSuccess, (state, { uploads }) => ({ ...state, loading: false, myUploads: uploads })),
  on(PharmacyActions.loadMyUploadsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PharmacyActions.loadUploads, (state) => ({ ...state, loading: true, error: null })),
  on(PharmacyActions.loadUploadsSuccess, (state, { uploads, pagination }) => ({
    ...state,
    loading: false,
    uploads,
    uploadsPagination: pagination,
  })),
  on(PharmacyActions.loadUploadsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PharmacyActions.uploadPrescription, (state) => ({ ...state, saving: true, error: null })),
  on(PharmacyActions.uploadPrescriptionSuccess, (state, { upload, message }) => ({
    ...state,
    saving: false,
    myUploads: [upload, ...state.myUploads],
    successMessage: message,
  })),
  on(PharmacyActions.uploadPrescriptionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PharmacyActions.reviewUpload, (state) => ({ ...state, saving: true, error: null })),
  on(PharmacyActions.reviewUploadSuccess, (state, { upload, message }) => ({
    ...state,
    saving: false,
    uploads: state.uploads.map((u) => (u.id === upload.id ? upload : u)),
    successMessage: message,
  })),
  on(PharmacyActions.reviewUploadFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PharmacyActions.clearError, (state) => ({ ...state, error: null })),
  on(PharmacyActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);

export const pharmacyFeature = createFeature({
  name: 'pharmacy',
  reducer: pharmacyReducer,
});
