import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicalRecordService } from '../../services/medical-record.service';
import { MedicalRecordTableComponent } from '../../components/medical-record-table/medical-record-table.component';
import { MedicalRecordDetailComponent } from '../../components/medical-record-detail/medical-record-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { MedicalRecord, MEDICAL_RECORD_TYPE_OPTIONS } from '../../../../core/models/medical-record.model';

@Component({
  selector: 'app-admin-medical-record-list-page',
  standalone: true,
  imports: [
    FormsModule,
    MedicalRecordTableComponent,
    MedicalRecordDetailComponent,
    AlertComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-medical-record-list-page.component.html',
  styleUrl: './admin-medical-record-list-page.component.scss',
})
export class AdminMedicalRecordListPageComponent implements OnInit {
  protected readonly recordService = inject(MedicalRecordService);
  readonly search = signal('');
  readonly recordType = signal('');
  readonly viewing = signal<MedicalRecord | null>(null);
  readonly typeOptions = MEDICAL_RECORD_TYPE_OPTIONS;

  ngOnInit(): void {
    this.recordService.clearError();
    this.recordService.clearSuccessMessage();
    this.recordService.loadRecords();
  }

  onSearch(): void {
    this.recordService.loadRecords({
      search: this.search(),
      recordType: this.recordType(),
      page: 1,
    });
  }

  onPageChange(page: number): void {
    this.recordService.loadRecords({ page });
  }

  onView(r: MedicalRecord): void {
    this.viewing.set(r);
    this.recordService.loadRecordHistory(r.id);
  }

  onDownload(r: MedicalRecord): void {
    this.recordService.downloadRecord(r.id, r.originalFileName);
  }

  onDownloadVersion(version: number): void {
    const r = this.viewing();
    if (!r) return;
    this.recordService.downloadRecord(r.id, r.originalFileName, version);
  }

  onDelete(r: MedicalRecord): void {
    if (confirm('Remove this medical record?')) {
      this.recordService.deleteRecord(r.id);
      if (this.viewing()?.id === r.id) this.viewing.set(null);
    }
  }

  closeDetail(): void {
    this.viewing.set(null);
    this.recordService.clearSelectedRecord();
  }
}
