import { Component, input, output } from '@angular/core';
import {
  MedicalRecord,
  formatFileSize,
  formatRecordDate,
  medicalRecordTypeLabel,
} from '../../../../core/models/medical-record.model';

@Component({
  selector: 'app-medical-record-table',
  standalone: true,
  templateUrl: './medical-record-table.component.html',
  styleUrl: './medical-record-table.component.scss',
})
export class MedicalRecordTableComponent {
  readonly records = input<MedicalRecord[]>([]);
  readonly loading = input(false);
  readonly showPatient = input(false);
  readonly showActions = input(true);
  readonly adminMode = input(false);

  readonly viewRecord = output<MedicalRecord>();
  readonly downloadRecord = output<MedicalRecord>();
  readonly deleteRecord = output<MedicalRecord>();

  readonly formatDate = formatRecordDate;
  readonly formatSize = formatFileSize;
  readonly typeLabel = medicalRecordTypeLabel;

  colspan(): number {
    let cols = 4;
    if (this.showPatient()) cols++;
    if (this.showActions()) cols++;
    return cols;
  }
}
