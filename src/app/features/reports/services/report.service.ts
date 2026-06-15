import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExportFormat, ReportQuery, ReportType } from '../../../core/models/report.model';
import { ReportsActions } from '../store/reports.actions';
import {
  selectActiveReportType,
  selectReport,
  selectReportQuery,
  selectReportsError,
  selectReportsExporting,
  selectReportsLoading,
  selectReportsSuccessMessage,
} from '../store/reports.selectors';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly store = inject(Store);

  readonly activeType = this.store.selectSignal(selectActiveReportType);
  readonly report = this.store.selectSignal(selectReport);
  readonly query = this.store.selectSignal(selectReportQuery);
  readonly loading = this.store.selectSignal(selectReportsLoading);
  readonly exporting = this.store.selectSignal(selectReportsExporting);
  readonly error = this.store.selectSignal(selectReportsError);
  readonly successMessage = this.store.selectSignal(selectReportsSuccessMessage);

  setActiveType(reportType: ReportType): void {
    this.store.dispatch(ReportsActions.setActiveType({ reportType }));
  }

  setQuery(query: Partial<ReportQuery>): void {
    this.store.dispatch(ReportsActions.setQuery({ query }));
  }

  loadReport(reportType?: ReportType, query?: Partial<ReportQuery>): void {
    this.store.dispatch(ReportsActions.loadReport({ reportType, query }));
  }

  exportReport(format: ExportFormat, reportType?: ReportType, query?: Partial<ReportQuery>): void {
    this.store.dispatch(ReportsActions.exportReport({ reportType, format, query }));
  }

  clearError(): void {
    this.store.dispatch(ReportsActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(ReportsActions.clearSuccessMessage());
  }
}
