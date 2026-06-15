import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Clinic } from '../../../../core/models/clinic.model';

@Component({
  selector: 'app-clinic-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './clinic-table.component.html',
  styleUrl: './clinic-table.component.scss',
})
export class ClinicTableComponent {
  readonly clinics = input<Clinic[]>([]);
  readonly loading = input(false);
  readonly deleteClinic = output<string>();
}
