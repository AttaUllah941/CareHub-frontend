import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserRole } from '../../core/models/auth.model';
import { DoctorPortalService } from '../../features/doctor-portal/services/doctor-portal.service';
import { NotificationBellComponent } from '../../core/components/notification-bell/notification-bell.component';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';

interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationBellComponent, IconComponent],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.scss',
})
export class DoctorLayoutComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly portal = inject(DoctorPortalService);
  protected readonly UserRole = UserRole;
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: 'dashboard' },
    { label: 'Profile', path: '/doctor/profile', icon: 'profile' },
    { label: 'Appointments', path: '/doctor/appointments', icon: 'appointments' },
    { label: 'Schedule', path: '/doctor/schedule', icon: 'schedule' },
    { label: 'Video Consultations', path: '/doctor/consultations', icon: 'consultations' },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: 'prescriptions' },
    { label: 'Patients', path: '/doctor/patients', icon: 'patients' },
    { label: 'Earnings', path: '/doctor/earnings', icon: 'earnings' },
  ];

  ngOnInit(): void {
    this.portal.loadPortalData();
  }

  logout(): void {
    this.authService.logout();
  }
}
