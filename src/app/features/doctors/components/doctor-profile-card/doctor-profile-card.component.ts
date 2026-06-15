import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Doctor } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-profile-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './doctor-profile-card.component.html',
  styleUrl: './doctor-profile-card.component.scss',
})
export class DoctorProfileCardComponent {
  readonly doctor = input.required<Doctor>();

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
