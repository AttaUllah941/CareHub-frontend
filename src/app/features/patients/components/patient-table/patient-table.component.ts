import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Patient } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.scss',
})
export class PatientTableComponent {
  readonly patients = input<Patient[]>([]);
  readonly loading = input(false);
  readonly deletePatient = output<string>();
}
