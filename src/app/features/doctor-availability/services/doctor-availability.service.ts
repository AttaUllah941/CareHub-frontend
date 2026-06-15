import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UpdateAvailabilityRequest } from '../../../core/models/doctor-availability.model';
import { DoctorAvailabilityActions } from '../store/doctor-availability.actions';
import {
  selectAvailability,
  selectAvailabilityError,
  selectAvailabilityLoading,
  selectAvailabilitySaving,
  selectAvailabilitySuccessMessage,
  selectPreviewDate,
  selectPreviewSlots,
} from '../store/doctor-availability.selectors';

@Injectable({ providedIn: 'root' })
export class DoctorAvailabilityService {
  private readonly store = inject(Store);

  readonly availability = this.store.selectSignal(selectAvailability);
  readonly previewSlots = this.store.selectSignal(selectPreviewSlots);
  readonly previewDate = this.store.selectSignal(selectPreviewDate);
  readonly loading = this.store.selectSignal(selectAvailabilityLoading);
  readonly saving = this.store.selectSignal(selectAvailabilitySaving);
  readonly error = this.store.selectSignal(selectAvailabilityError);
  readonly successMessage = this.store.selectSignal(selectAvailabilitySuccessMessage);

  loadAvailability(): void {
    this.store.dispatch(DoctorAvailabilityActions.loadAvailability());
  }

  updateAvailability(payload: UpdateAvailabilityRequest): void {
    this.store.dispatch(DoctorAvailabilityActions.updateAvailability({ payload }));
  }

  loadSlotsPreview(date: string): void {
    this.store.dispatch(DoctorAvailabilityActions.loadSlotsPreview({ date }));
  }

  clearError(): void {
    this.store.dispatch(DoctorAvailabilityActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(DoctorAvailabilityActions.clearSuccessMessage());
  }
}
