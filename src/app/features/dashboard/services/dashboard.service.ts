import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from '../store/dashboard.actions';
import {
  selectAdminStats,
  selectDashboardError,
  selectDashboardLoading,
} from '../store/dashboard.selectors';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly store = inject(Store);

  readonly adminStats = this.store.selectSignal(selectAdminStats);
  readonly loading = this.store.selectSignal(selectDashboardLoading);
  readonly error = this.store.selectSignal(selectDashboardError);

  loadAdminStats(): void {
    this.store.dispatch(DashboardActions.loadAdminStats());
  }

  clearError(): void {
    this.store.dispatch(DashboardActions.clearError());
  }
}
