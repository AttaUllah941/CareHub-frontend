import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicalRecordService } from '../../services/medical-record.service';
import { MedicalRecordTableComponent } from '../../components/medical-record-table/medical-record-table.component';
import { MedicalRecordDetailComponent } from '../../components/medical-record-detail/medical-record-detail.component';
import { MedicalRecordUploadFormComponent } from '../../components/medical-record-upload-form/medical-record-upload-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import {
  MEDICAL_RECORD_TYPE_OPTIONS,
  MedicalRecord,
  UploadMedicalRecordRequest,
} from '../../../../core/models/medical-record.model';

@Component({
  selector: 'app-medical-record-list-page',
  standalone: true,
  imports: [
    FormsModule,
    MedicalRecordTableComponent,
    MedicalRecordDetailComponent,
    MedicalRecordUploadFormComponent,
    AlertComponent,
  ],
  templateUrl: './medical-record-list-page.component.html',
  styleUrl: './medical-record-list-page.component.scss',
})
export class MedicalRecordListPageComponent implements OnInit {
  protected readonly recordService = inject(MedicalRecordService);
  readonly selected = signal<MedicalRecord | null>(null);
  readonly showUpload = signal(false);
  readonly typeFilter = signal('');
  readonly typeOptions = MEDICAL_RECORD_TYPE_OPTIONS;

  ngOnInit(): void {
    this.recordService.clearError();
    this.recordService.clearSuccessMessage();
    this.loadRecords();
  }

  loadRecords(): void {
    const type = this.typeFilter() || undefined;
    this.recordService.loadMyRecords(type);
  }

  onFilterChange(): void {
    this.loadRecords();
  }

  onView(r: MedicalRecord): void {
    this.selected.set(r);
    this.recordService.loadRecordHistory(r.id);
  }

  onDownload(r: MedicalRecord): void {
    this.recordService.downloadRecord(r.id, r.originalFileName);
  }

  onDownloadVersion(version: number): void {
    const r = this.selected();
    if (!r) return;
    this.recordService.downloadRecord(r.id, r.originalFileName, version);
  }

  onUpload(payload: UploadMedicalRecordRequest): void {
    this.recordService.uploadRecord(payload);
    this.showUpload.set(false);
    setTimeout(() => this.loadRecords(), 500);
  }

  onUploadVersion(data: { file: File; changeNote?: string }): void {
    const r = this.selected();
    if (!r) return;
    this.recordService.uploadNewVersion(r.id, data.file, data.changeNote);
    setTimeout(() => {
      this.recordService.loadRecordHistory(r.id);
      this.loadRecords();
    }, 500);
  }

  closeDetail(): void {
    this.selected.set(null);
    this.recordService.clearSelectedRecord();
  }
}
