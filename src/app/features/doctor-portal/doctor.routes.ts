import { Routes } from '@angular/router';
import { doctorGuestGuard, doctorPortalGuard } from './guards/doctor-portal.guard';

export const DOCTOR_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [doctorGuestGuard],
    loadComponent: () =>
      import('./pages/doctor-login-page/doctor-login-page.component').then(
        (m) => m.DoctorLoginPageComponent,
      ),
  },
  {
    path: '',
    canActivate: [doctorPortalGuard],
    loadComponent: () =>
      import('../../layouts/doctor-layout/doctor-layout.component').then((m) => m.DoctorLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/doctor-dashboard-page/doctor-dashboard-page.component').then(
            (m) => m.DoctorDashboardPageComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/doctor-profile-page/doctor-profile-page.component').then(
            (m) => m.DoctorProfilePageComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./pages/doctor-appointments-page/doctor-appointments-page.component').then(
            (m) => m.DoctorAppointmentsPageComponent,
          ),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./pages/doctor-schedule-page/doctor-schedule-page.component').then(
            (m) => m.DoctorSchedulePageComponent,
          ),
      },
      {
        path: 'consultations',
        loadComponent: () =>
          import('./pages/doctor-consultations-page/doctor-consultations-page.component').then(
            (m) => m.DoctorConsultationsPageComponent,
          ),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./pages/doctor-prescriptions-page/doctor-prescriptions-page.component').then(
            (m) => m.DoctorPrescriptionsPageComponent,
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./pages/doctor-patients-page/doctor-patients-page.component').then(
            (m) => m.DoctorPatientsPageComponent,
          ),
      },
      {
        path: 'earnings',
        loadComponent: () =>
          import('./pages/doctor-earnings-page/doctor-earnings-page.component').then(
            (m) => m.DoctorEarningsPageComponent,
          ),
      },
    ],
  },
];
