import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ClinicListQuery,
  CreateClinicRequest,
  UpdateClinicRequest,
} from '../../../core/models/clinic.model';
import { ClinicsActions } from '../store/clinics.actions';
import {
  selectAllClinics,
  selectClinics,
  selectClinicsError,
  selectClinicsLoading,
  selectClinicsPagination,
  selectClinicsQuery,
  selectClinicsSaving,
  selectClinicsSuccessMessage,
  selectMyClinic,
  selectSelectedClinic,
} from '../store/clinics.selectors';

@Injectable({ providedIn: 'root' })
export class ClinicService {
  private readonly store = inject(Store);

  readonly clinics = this.store.selectSignal(selectClinics);
  readonly allClinics = this.store.selectSignal(selectAllClinics);
  readonly selectedClinic = this.store.selectSignal(selectSelectedClinic);
  readonly myClinic = this.store.selectSignal(selectMyClinic);
  readonly pagination = this.store.selectSignal(selectClinicsPagination);
  readonly query = this.store.selectSignal(selectClinicsQuery);
  readonly loading = this.store.selectSignal(selectClinicsLoading);
  readonly saving = this.store.selectSignal(selectClinicsSaving);
  readonly error = this.store.selectSignal(selectClinicsError);
  readonly successMessage = this.store.selectSignal(selectClinicsSuccessMessage);

  loadClinics(query?: Partial<ClinicListQuery>): void {
    this.store.dispatch(ClinicsActions.loadClinics({ query }));
  }

  loadAllClinics(): void {
    this.store.dispatch(ClinicsActions.loadAllClinics());
  }

  loadClinic(id: string): void {
    this.store.dispatch(ClinicsActions.loadClinic({ id }));
  }

  loadMyClinic(): void {
    this.store.dispatch(ClinicsActions.loadMyClinic());
  }

  createClinic(payload: CreateClinicRequest): void {
    this.store.dispatch(ClinicsActions.createClinic({ payload }));
  }

  updateClinic(id: string, payload: UpdateClinicRequest): void {
    this.store.dispatch(ClinicsActions.updateClinic({ id, payload }));
  }

  updateMyClinic(payload: UpdateClinicRequest): void {
    this.store.dispatch(ClinicsActions.updateMyClinic({ payload }));
  }

  assignDoctors(id: string, doctorProfileIds: string[]): void {
    this.store.dispatch(ClinicsActions.assignDoctors({ id, doctorProfileIds }));
  }

  deleteClinic(id: string): void {
    this.store.dispatch(ClinicsActions.deleteClinic({ id }));
  }

  clearError(): void {
    this.store.dispatch(ClinicsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(ClinicsActions.clearSuccessMessage());
  }
}
