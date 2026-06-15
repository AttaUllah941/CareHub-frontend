import { Component, input, output } from '@angular/core';
import {
  Consultation,
  formatConsultationDate,
} from '../../../../core/models/consultation.model';
import { formatAppointmentDateTime } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-consultation-table',
  standalone: true,
  templateUrl: './consultation-table.component.html',
  styleUrl: './consultation-table.component.scss',
})
export class ConsultationTableComponent {
  readonly consultations = input<Consultation[]>([]);
  readonly loading = input(false);
  readonly showPatient = input(false);
  readonly showActions = input(true);
  readonly adminMode = input(false);
  readonly doctorMode = input(false);

  readonly viewConsultation = output<Consultation>();
  readonly editConsultation = output<Consultation>();
  readonly deleteConsultation = output<Consultation>();

  readonly formatDate = formatConsultationDate;
  readonly formatAppointmentDateTime = formatAppointmentDateTime;
}
