import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MEDICAL_RECORD_TYPE_OPTIONS,
  MedicalRecordType,
  UploadMedicalRecordRequest,
} from '../../../../core/models/medical-record.model';

@Component({
  selector: 'app-medical-record-upload-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './medical-record-upload-form.component.html',
  styleUrl: './medical-record-upload-form.component.scss',
})
export class MedicalRecordUploadFormComponent {
  readonly saving = input(false);
  readonly showPatientId = input(false);

  readonly upload = output<UploadMedicalRecordRequest>();

  readonly typeOptions = MEDICAL_RECORD_TYPE_OPTIONS;
  readonly recordType = signal<MedicalRecordType>('REPORT');
  readonly title = signal('');
  readonly description = signal('');
  readonly patientProfileId = signal('');
  readonly selectedFile = signal<File | null>(null);
  readonly fileError = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
    this.fileError.set(null);
  }

  submit(): void {
    const file = this.selectedFile();
    if (!file) {
      this.fileError.set('Please select a file');
      return;
    }
    if (!this.title().trim()) return;

    const payload: UploadMedicalRecordRequest = {
      file,
      recordType: this.recordType(),
      title: this.title().trim(),
      description: this.description().trim() || undefined,
    };
    if (this.showPatientId() && this.patientProfileId().trim()) {
      payload.patientProfileId = this.patientProfileId().trim();
    }
    this.upload.emit(payload);
  }

  reset(): void {
    this.title.set('');
    this.description.set('');
    this.recordType.set('REPORT');
    this.selectedFile.set(null);
    this.fileError.set(null);
  }
}
