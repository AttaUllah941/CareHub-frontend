import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreatePrescriptionRequest,
  PrescriptionListQuery,
  UpdatePrescriptionRequest,
} from '../../../core/models/prescription.model';
import { PrescriptionsActions } from '../store/prescriptions.actions';
import {
  selectDoctorPrescriptions,
  selectMyPrescriptions,
  selectPrescriptions,
  selectPrescriptionsDownloading,
  selectPrescriptionsError,
  selectPrescriptionsLoading,
  selectPrescriptionsPagination,
  selectPrescriptionsQuery,
  selectPrescriptionsSaving,
  selectPrescriptionsSuccessMessage,
  selectSelectedPrescription,
} from '../store/prescriptions.selectors';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly store = inject(Store);

  readonly prescriptions = this.store.selectSignal(selectPrescriptions);
  readonly myPrescriptions = this.store.selectSignal(selectMyPrescriptions);
  readonly doctorPrescriptions = this.store.selectSignal(selectDoctorPrescriptions);
  readonly selectedPrescription = this.store.selectSignal(selectSelectedPrescription);
  readonly pagination = this.store.selectSignal(selectPrescriptionsPagination);
  readonly query = this.store.selectSignal(selectPrescriptionsQuery);
  readonly loading = this.store.selectSignal(selectPrescriptionsLoading);
  readonly saving = this.store.selectSignal(selectPrescriptionsSaving);
  readonly downloading = this.store.selectSignal(selectPrescriptionsDownloading);
  readonly error = this.store.selectSignal(selectPrescriptionsError);
  readonly successMessage = this.store.selectSignal(selectPrescriptionsSuccessMessage);

  loadPrescriptions(query?: Partial<PrescriptionListQuery>): void {
    this.store.dispatch(PrescriptionsActions.loadPrescriptions({ query }));
  }

  loadMyPrescriptions(): void {
    this.store.dispatch(PrescriptionsActions.loadMyPrescriptions());
  }

  loadDoctorPrescriptions(): void {
    this.store.dispatch(PrescriptionsActions.loadDoctorPrescriptions());
  }

  loadByConsultation(consultationId: string): void {
    this.store.dispatch(PrescriptionsActions.loadByConsultation({ consultationId }));
  }

  createPrescription(consultationId: string, payload: CreatePrescriptionRequest): void {
    this.store.dispatch(PrescriptionsActions.createPrescription({ consultationId, payload }));
  }

  updatePrescription(id: string, payload: UpdatePrescriptionRequest): void {
    this.store.dispatch(PrescriptionsActions.updatePrescription({ id, payload }));
  }

  deletePrescription(id: string): void {
    this.store.dispatch(PrescriptionsActions.deletePrescription({ id }));
  }

  downloadPdf(id: string, filename?: string): void {
    this.store.dispatch(PrescriptionsActions.downloadPdf({ id, filename }));
  }

  clearSelectedPrescription(): void {
    this.store.dispatch(PrescriptionsActions.clearSelectedPrescription());
  }

  clearError(): void {
    this.store.dispatch(PrescriptionsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(PrescriptionsActions.clearSuccessMessage());
  }
}
