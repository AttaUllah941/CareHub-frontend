import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/auth.model';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin/roles',
    loadChildren: () => import('./features/roles/roles.routes').then((m) => m.ROLES_ROUTES),
  },
  {
    path: 'admin/permissions',
    loadChildren: () => import('./features/roles/roles.routes').then((m) => m.PERMISSIONS_ROUTES),
  },
  {
    path: 'admin/users',
    loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'admin/medical-specialties',
    loadChildren: () =>
      import('./features/medical-specialties/medical-specialties.routes').then(
        (m) => m.MEDICAL_SPECIALTIES_ROUTES,
      ),
  },
  {
    path: 'admin/languages',
    loadChildren: () => import('./features/languages/languages.routes').then((m) => m.LANGUAGES_ROUTES),
  },
  {
    path: 'admin/doctors',
    loadChildren: () => import('./features/doctors/doctors.routes').then((m) => m.ADMIN_DOCTORS_ROUTES),
  },
  {
    path: 'admin/clinics',
    loadChildren: () => import('./features/clinics/clinics.routes').then((m) => m.ADMIN_CLINICS_ROUTES),
  },
  {
    path: 'admin/patients',
    loadChildren: () => import('./features/patients/patients.routes').then((m) => m.ADMIN_PATIENTS_ROUTES),
  },
  {
    path: 'admin/prescriptions',
    loadChildren: () => import('./features/prescriptions/prescriptions.routes').then((m) => m.ADMIN_PRESCRIPTIONS_ROUTES),
  },
  {
    path: 'admin/medical-records',
    loadChildren: () => import('./features/medical-records/medical-records.routes').then((m) => m.ADMIN_MEDICAL_RECORDS_ROUTES),
  },
  {
    path: 'admin/reviews',
    loadChildren: () => import('./features/reviews/reviews.routes').then((m) => m.ADMIN_REVIEWS_ROUTES),
  },
  {
    path: 'admin/notifications',
    loadChildren: () => import('./features/notifications/notifications.routes').then((m) => m.ADMIN_NOTIFICATIONS_ROUTES),
  },
  {
    path: 'admin/payments',
    loadChildren: () => import('./features/payments/payments.routes').then((m) => m.ADMIN_PAYMENTS_ROUTES),
  },
  {
    path: 'admin/consultations',
    loadChildren: () => import('./features/consultations/consultations.routes').then((m) => m.ADMIN_CONSULTATIONS_ROUTES),
  },
  {
    path: 'admin/appointments',
    loadChildren: () => import('./features/appointments/appointments.routes').then((m) => m.ADMIN_APPOINTMENTS_ROUTES),
  },
  {
    path: 'doctor',
    loadChildren: () => import('./features/doctors/doctors.routes').then((m) => m.DOCTOR_PORTAL_ROUTES),
  },
  {
    path: 'clinic',
    loadChildren: () => import('./features/clinics/clinics.routes').then((m) => m.CLINIC_PORTAL_ROUTES),
  },
  {
    path: 'patient',
    loadChildren: () => import('./features/patients/patients.routes').then((m) => m.PATIENT_PORTAL_ROUTES),
  },
  {
    path: 'admin/dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.ADMIN_DASHBOARD_ROUTES),
  },
  {
    path: 'admin/reports',
    loadChildren: () => import('./features/reports/reports.routes').then((m) => m.ADMIN_REPORTS_ROUTES),
  },
  {
    path: 'admin/analytics',
    loadChildren: () => import('./features/analytics/analytics.routes').then((m) => m.ADMIN_ANALYTICS_ROUTES),
  },
  {
    path: 'admin/audit-logs',
    loadChildren: () => import('./features/audit-logs/audit-logs.routes').then((m) => m.ADMIN_AUDIT_LOG_ROUTES),
  },
  {
    path: 'admin/settings',
    loadChildren: () => import('./features/settings/settings.routes').then((m) => m.ADMIN_SETTINGS_ROUTES),
  },
  {
    path: 'admin/pharmacy',
    loadChildren: () => import('./features/pharmacy/pharmacy.routes').then((m) => m.ADMIN_PHARMACY_ROUTES),
  },
  {
    path: 'pharmacy',
    loadChildren: () => import('./features/pharmacy/pharmacy.routes').then((m) => m.PHARMACY_PORTAL_ROUTES),
  },
  {
    path: 'admin/lab',
    loadChildren: () => import('./features/lab/lab.routes').then((m) => m.ADMIN_LAB_ROUTES),
  },
  {
    path: 'lab',
    loadChildren: () => import('./features/lab/lab.routes').then((m) => m.LAB_PORTAL_ROUTES),
  },
  {
    path: 'dashboard',
    redirectTo: 'patient/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/errors/pages/unauthorized-page/unauthorized-page.component').then(
        (m) => m.UnauthorizedPageComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
