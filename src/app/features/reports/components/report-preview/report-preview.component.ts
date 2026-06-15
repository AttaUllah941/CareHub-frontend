import { Component, input } from '@angular/core';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { AnyReport } from '../../../../core/models/report.model';

@Component({
  selector: 'app-report-preview',
  standalone: true,
  imports: [DatePipe, KeyValuePipe],
  templateUrl: './report-preview.component.html',
  styleUrl: './report-preview.component.scss',
})
export class ReportPreviewComponent {
  readonly report = input.required<AnyReport>();

  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  }

  tableKeys(report: AnyReport): string[] {
    if (!report.rows.length) return [];
    return Object.keys(report.rows[0]).filter((k) => k !== 'id');
  }

  tableColumns(report: AnyReport): string[] {
    return this.tableKeys(report).map((k) => this.formatKey(k));
  }

  displayCell(row: Record<string, unknown>, key: string): string {
    const val = row[key];
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  }
}
