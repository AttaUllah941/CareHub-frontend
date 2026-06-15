import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnalyticsQuery } from '../../../core/models/analytics.model';
import { AnalyticsActions } from '../store/analytics.actions';
import {
  selectAnalyticsError,
  selectAnalyticsLoading,
  selectAnalyticsOverview,
  selectAnalyticsQuery,
  selectAppointmentGrowth,
  selectDoctorGrowth,
  selectPatientGrowth,
  selectRevenueTrend,
} from '../store/analytics.selectors';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly store = inject(Store);

  readonly overview = this.store.selectSignal(selectAnalyticsOverview);
  readonly query = this.store.selectSignal(selectAnalyticsQuery);
  readonly loading = this.store.selectSignal(selectAnalyticsLoading);
  readonly error = this.store.selectSignal(selectAnalyticsError);
  readonly revenue = this.store.selectSignal(selectRevenueTrend);
  readonly doctors = this.store.selectSignal(selectDoctorGrowth);
  readonly patients = this.store.selectSignal(selectPatientGrowth);
  readonly appointments = this.store.selectSignal(selectAppointmentGrowth);

  loadOverview(query?: AnalyticsQuery): void {
    this.store.dispatch(AnalyticsActions.loadOverview({ query }));
  }

  setQuery(query: AnalyticsQuery): void {
    this.store.dispatch(AnalyticsActions.setQuery({ query }));
  }

  clearError(): void {
    this.store.dispatch(AnalyticsActions.clearError());
  }
}
