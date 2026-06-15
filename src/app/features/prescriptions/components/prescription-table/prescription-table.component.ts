import { Component, input, output } from '@angular/core';
import { Prescription, formatPrescriptionDate } from '../../../../core/models/prescription.model';

@Component({
  selector: 'app-prescription-table',
  standalone: true,
  templateUrl: './prescription-table.component.html',
  styleUrl: './prescription-table.component.scss',
})
export class PrescriptionTableComponent {
  readonly prescriptions = input<Prescription[]>([]);
  readonly loading = input(false);
  readonly showPatient = input(false);
  readonly showActions = input(true);
  readonly adminMode = input(false);
  readonly doctorMode = input(false);

  readonly viewPrescription = output<Prescription>();
  readonly editPrescription = output<Prescription>();
  readonly deletePrescription = output<Prescription>();
  readonly downloadPdf = output<Prescription>();

  readonly formatDate = formatPrescriptionDate;

  medicineSummary(p: Prescription): string {
    const names = p.medicines.map((m) => m.name);
    return names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ');
  }
}
