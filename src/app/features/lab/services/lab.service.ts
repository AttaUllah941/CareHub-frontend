import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreateLabBookingRequest, CreateLabRequest, CreateLabTestRequest, LabListQuery } from '../../../core/models/lab.model';
import { LabActions } from '../store/lab.actions';
import {
  selectLabBookings,
  selectLabError,
  selectLabLoading,
  selectLabReports,
  selectLabs,
  selectLabSaving,
  selectLabSuccessMessage,
  selectLabTests,
  selectMyLabBookings,
  selectMyLabReports,
} from '../store/lab.selectors';

@Injectable({ providedIn: 'root' })
export class LabService {
  private readonly store = inject(Store);

  readonly labs = this.store.selectSignal(selectLabs);
  readonly tests = this.store.selectSignal(selectLabTests);
  readonly bookings = this.store.selectSignal(selectLabBookings);
  readonly myBookings = this.store.selectSignal(selectMyLabBookings);
  readonly reports = this.store.selectSignal(selectLabReports);
  readonly myReports = this.store.selectSignal(selectMyLabReports);
  readonly loading = this.store.selectSignal(selectLabLoading);
  readonly saving = this.store.selectSignal(selectLabSaving);
  readonly error = this.store.selectSignal(selectLabError);
  readonly successMessage = this.store.selectSignal(selectLabSuccessMessage);

  loadLabs(query?: Partial<LabListQuery>): void {
    this.store.dispatch(LabActions.loadLabs({ query }));
  }

  createLab(payload: CreateLabRequest): void {
    this.store.dispatch(LabActions.createLab({ payload }));
  }

  loadTests(query?: Record<string, string | number | boolean>): void {
    this.store.dispatch(LabActions.loadTests({ query }));
  }

  createTest(payload: CreateLabTestRequest): void {
    this.store.dispatch(LabActions.createTest({ payload }));
  }

  loadBookings(query?: Record<string, string | number>): void {
    this.store.dispatch(LabActions.loadBookings({ query }));
  }

  loadMyBookings(): void {
    this.store.dispatch(LabActions.loadMyBookings());
  }

  createBooking(payload: CreateLabBookingRequest): void {
    this.store.dispatch(LabActions.createBooking({ payload }));
  }

  updateBookingStatus(id: string, status: string, notes?: string): void {
    this.store.dispatch(LabActions.updateBookingStatus({ id, status, notes }));
  }

  loadMyReports(): void {
    this.store.dispatch(LabActions.loadMyReports());
  }

  loadReports(query?: Record<string, string | number>): void {
    this.store.dispatch(LabActions.loadReports({ query }));
  }

  uploadReport(formData: FormData): void {
    this.store.dispatch(LabActions.uploadReport({ formData }));
  }

  clearError(): void {
    this.store.dispatch(LabActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(LabActions.clearSuccessMessage());
  }
}
