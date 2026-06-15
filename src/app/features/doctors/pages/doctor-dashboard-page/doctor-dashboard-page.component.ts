import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { DoctorService } from '../../services/doctor.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-doctor-dashboard-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, AlertComponent],
  templateUrl: './doctor-dashboard-page.component.html',
  styleUrl: './doctor-dashboard-page.component.scss',
})
export class DoctorDashboardPageComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly doctorService = inject(DoctorService);

  ngOnInit(): void {
    this.doctorService.clearError();
    this.doctorService.loadMyProfile();
  }

  verificationClass(status?: string): string {
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
