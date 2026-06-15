import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateMedicineRequest,
  CreatePharmacyOrderRequest,
  MedicineListQuery,
  UpsertInventoryRequest,
} from '../../../core/models/pharmacy.model';
import { PharmacyActions } from '../store/pharmacy.actions';
import {
  selectInventory,
  selectMedicines,
  selectMedicinesPagination,
  selectMyPharmacyOrders,
  selectMyPrescriptionUploads,
  selectPharmacyError,
  selectPharmacyLoading,
  selectPharmacyOrders,
  selectPharmacySaving,
  selectPharmacySuccessMessage,
  selectPrescriptionUploads,
} from '../store/pharmacy.selectors';

@Injectable({ providedIn: 'root' })
export class PharmacyService {
  private readonly store = inject(Store);

  readonly medicines = this.store.selectSignal(selectMedicines);
  readonly medicinesPagination = this.store.selectSignal(selectMedicinesPagination);
  readonly inventory = this.store.selectSignal(selectInventory);
  readonly orders = this.store.selectSignal(selectPharmacyOrders);
  readonly myOrders = this.store.selectSignal(selectMyPharmacyOrders);
  readonly uploads = this.store.selectSignal(selectPrescriptionUploads);
  readonly myUploads = this.store.selectSignal(selectMyPrescriptionUploads);
  readonly loading = this.store.selectSignal(selectPharmacyLoading);
  readonly saving = this.store.selectSignal(selectPharmacySaving);
  readonly error = this.store.selectSignal(selectPharmacyError);
  readonly successMessage = this.store.selectSignal(selectPharmacySuccessMessage);

  loadMedicines(query?: Partial<MedicineListQuery>): void {
    this.store.dispatch(PharmacyActions.loadMedicines({ query }));
  }

  createMedicine(payload: CreateMedicineRequest): void {
    this.store.dispatch(PharmacyActions.createMedicine({ payload }));
  }

  loadInventory(query?: Record<string, string | number | boolean>): void {
    this.store.dispatch(PharmacyActions.loadInventory({ query }));
  }

  upsertInventory(payload: UpsertInventoryRequest): void {
    this.store.dispatch(PharmacyActions.upsertInventory({ payload }));
  }

  loadOrders(query?: Record<string, string | number>): void {
    this.store.dispatch(PharmacyActions.loadOrders({ query }));
  }

  loadMyOrders(): void {
    this.store.dispatch(PharmacyActions.loadMyOrders());
  }

  createOrder(payload: CreatePharmacyOrderRequest): void {
    this.store.dispatch(PharmacyActions.createOrder({ payload }));
  }

  createOrderFromPrescription(prescriptionId: string, payload?: Partial<CreatePharmacyOrderRequest>): void {
    this.store.dispatch(PharmacyActions.createOrderFromPrescription({ prescriptionId, payload }));
  }

  updateOrderStatus(id: string, status: string, notes?: string): void {
    this.store.dispatch(PharmacyActions.updateOrderStatus({ id, status, notes }));
  }

  loadMyUploads(): void {
    this.store.dispatch(PharmacyActions.loadMyUploads());
  }

  loadUploads(query?: Record<string, string | number>): void {
    this.store.dispatch(PharmacyActions.loadUploads({ query }));
  }

  uploadPrescription(file: File, title?: string): void {
    this.store.dispatch(PharmacyActions.uploadPrescription({ file, title }));
  }

  reviewUpload(id: string, status: 'APPROVED' | 'REJECTED', reviewNotes?: string): void {
    this.store.dispatch(PharmacyActions.reviewUpload({ id, status, reviewNotes }));
  }

  clearError(): void {
    this.store.dispatch(PharmacyActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(PharmacyActions.clearSuccessMessage());
  }
}
