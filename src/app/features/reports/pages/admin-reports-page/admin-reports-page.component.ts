import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ReportPreviewComponent } from '../../components/report-preview/report-preview.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import {
  defaultDateRange,
  REPORT_TYPE_OPTIONS,
  ReportType,
} from '../../../../core/models/report.model';
import { APPOINTMENT_STATUS_OPTIONS } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-admin-reports-page',
  standalone: true,
  imports: [FormsModule, ReportPreviewComponent, AlertComponent],
  templateUrl: './admin-reports-page.component.html',
  styleUrl: './admin-reports-page.component.scss',
})
export class AdminReportsPageComponent implements OnInit {
  protected readonly reportService = inject(ReportService);

  readonly typeOptions = REPORT_TYPE_OPTIONS;
  readonly statusOptions = APPOINTMENT_STATUS_OPTIONS;
  readonly verificationOptions = [
    { value: '', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'VERIFIED', label: 'Verified' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  readonly activeTab = signal<ReportType>('REVENUE');
  readonly fromDate = signal('');
  readonly toDate = signal('');
  readonly statusFilter = signal('');
  readonly verificationFilter = signal('');

  ngOnInit(): void {
    const range = defaultDateRange();
    this.fromDate.set(range.fromDate);
    this.toDate.set(range.toDate);
    this.reportService.clearError();
    this.reportService.clearSuccessMessage();
    this.reportService.setActiveType('REVENUE');
    this.reportService.setQuery(range);
    this.loadReport();
  }

  selectTab(type: ReportType): void {
    this.activeTab.set(type);
    this.reportService.setActiveType(type);
    this.loadReport();
  }

  loadReport(): void {
    this.reportService.loadReport(this.activeTab(), {
      fromDate: this.fromDate(),
      toDate: this.toDate(),
      status: this.statusFilter(),
      verificationStatus: this.verificationFilter(),
    });
  }

  exportPdf(): void {
    this.reportService.exportReport('pdf', this.activeTab(), {
      fromDate: this.fromDate(),
      toDate: this.toDate(),
      status: this.statusFilter(),
      verificationStatus: this.verificationFilter(),
    });
  }

  exportExcel(): void {
    this.reportService.exportReport('excel', this.activeTab(), {
      fromDate: this.fromDate(),
      toDate: this.toDate(),
      status: this.statusFilter(),
      verificationStatus: this.verificationFilter(),
    });
  }
}
