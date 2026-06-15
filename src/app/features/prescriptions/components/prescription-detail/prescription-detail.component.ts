import { Component, input, output } from '@angular/core';
import { Prescription, formatPrescriptionDate } from '../../../../core/models/prescription.model';
import { formatAppointmentDateTime } from '../../../../core/models/appointment.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-prescription-detail',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './prescription-detail.component.html',
  styleUrl: './prescription-detail.component.scss',
})
export class PrescriptionDetailComponent {
  readonly prescription = input.required<Prescription>();
  readonly downloading = input(false);
  readonly showDownload = input(true);
  readonly downloadPdf = output<void>();

  readonly formatDate = formatPrescriptionDate;
  readonly formatAppointmentDateTime = formatAppointmentDateTime;
}
