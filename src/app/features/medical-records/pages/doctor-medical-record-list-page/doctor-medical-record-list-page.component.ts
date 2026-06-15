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
  selector: 'app-doctor-medical-record-list-page',
  standalone: true,
  imports: [
    FormsModule,
    MedicalRecordTableComponent,
    MedicalRecordDetailComponent,
    MedicalRecordUploadFormComponent,
    AlertComponent,
  ],
  templateUrl: './doctor-medical-record-list-page.component.html',
  styleUrl: './doctor-medical-record-list-page.component.scss',
})
export class DoctorMedicalRecordListPageComponent implements OnInit {
  protected readonly recordService = inject(MedicalRecordService);
  readonly selected = signal<MedicalRecord | null>(null);
  readonly showUpload = signal(false);
  readonly patientProfileId = signal('');
  readonly typeFilter = signal('');
  readonly typeOptions = MEDICAL_RECORD_TYPE_OPTIONS;

  ngOnInit(): void {
    this.recordService.clearError();
    this.recordService.clearSuccessMessage();
  }

  searchPatientRecords(): void {
    const id = this.patientProfileId().trim();
    if (!id) return;
    this.recordService.loadByPatient(id, this.typeFilter() || undefined);
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
    if (!payload.patientProfileId && this.patientProfileId().trim()) {
      payload.patientProfileId = this.patientProfileId().trim();
    }
    this.recordService.uploadRecord(payload);
    this.showUpload.set(false);
    if (this.patientProfileId().trim()) {
      setTimeout(() => this.searchPatientRecords(), 500);
    }
  }

  onUploadVersion(data: { file: File; changeNote?: string }): void {
    const r = this.selected();
    if (!r) return;
    this.recordService.uploadNewVersion(r.id, data.file, data.changeNote);
    setTimeout(() => this.recordService.loadRecordHistory(r.id), 500);
  }

  closeDetail(): void {
    this.selected.set(null);
    this.recordService.clearSelectedRecord();
  }
}
