import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MedicalRecord,
  MedicalRecordHistoryEntry,
  formatFileSize,
  formatRecordDate,
  medicalRecordTypeLabel,
} from '../../../../core/models/medical-record.model';

@Component({
  selector: 'app-medical-record-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './medical-record-detail.component.html',
  styleUrl: './medical-record-detail.component.scss',
})
export class MedicalRecordDetailComponent {
  readonly record = input.required<MedicalRecord>();
  readonly history = input<MedicalRecordHistoryEntry[]>([]);
  readonly currentVersion = input(1);
  readonly downloading = input(false);
  readonly saving = input(false);
  readonly showVersionUpload = input(true);

  readonly download = output<void>();
  readonly downloadVersion = output<number>();
  readonly uploadVersion = output<{ file: File; changeNote?: string }>();

  readonly typeLabel = medicalRecordTypeLabel;
  readonly formatDate = formatRecordDate;
  readonly formatSize = formatFileSize;

  readonly versionFile = signal<File | null>(null);
  readonly changeNote = signal('');

  onVersionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.versionFile.set(input.files?.[0] ?? null);
  }

  submitVersion(): void {
    const file = this.versionFile();
    if (!file) return;
    this.uploadVersion.emit({ file, changeNote: this.changeNote().trim() || undefined });
    this.versionFile.set(null);
    this.changeNote.set('');
  }
}
