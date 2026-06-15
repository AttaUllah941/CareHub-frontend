import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Patient } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-profile-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './patient-profile-card.component.html',
  styleUrl: './patient-profile-card.component.scss',
})
export class PatientProfileCardComponent {
  readonly patient = input.required<Patient>();

  locationLabel(p: Patient): string {
    return [p.city, p.country].filter((x) => !!x).join(', ') || '—';
  }
}
