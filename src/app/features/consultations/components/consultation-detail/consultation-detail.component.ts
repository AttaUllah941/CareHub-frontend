import { Component, input } from '@angular/core';
import { Consultation } from '../../../../core/models/consultation.model';
import { formatAppointmentDateTime } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-consultation-detail',
  standalone: true,
  templateUrl: './consultation-detail.component.html',
  styleUrl: './consultation-detail.component.scss',
})
export class ConsultationDetailComponent {
  readonly consultation = input.required<Consultation>();
  readonly formatAppointmentDateTime = formatAppointmentDateTime;
}
