import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserRole } from '../../core/models/auth.model';
import { DoctorPortalService } from '../../features/doctor-portal/services/doctor-portal.service';
interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.scss',
})
export class DoctorLayoutComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly portal = inject(DoctorPortalService);
  protected readonly UserRole = UserRole;
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: '📊' },
    { label: 'Profile', path: '/doctor/profile', icon: '👤' },
    { label: 'Appointments', path: '/doctor/appointments', icon: '📅' },
    { label: 'Schedule', path: '/doctor/schedule', icon: '🕐' },
    { label: 'Video Consultations', path: '/doctor/consultations', icon: '📹' },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: '💊' },
    { label: 'Patients', path: '/doctor/patients', icon: '🩺' },
    { label: 'Earnings', path: '/doctor/earnings', icon: '💰' },
  ];

  ngOnInit(): void {
    this.portal.loadPortalData();
  }

  logout(): void {
    this.authService.logout();
  }
}
