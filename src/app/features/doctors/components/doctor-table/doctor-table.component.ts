import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doctor } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctor-table.component.html',
  styleUrl: './doctor-table.component.scss',
})
export class DoctorTableComponent {
  readonly doctors = input<Doctor[]>([]);
  readonly loading = input(false);
  readonly deleteDoctor = output<string>();

  verificationClass(status: string): string {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-50 text-green-700';
      case 'REJECTED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  }
}
