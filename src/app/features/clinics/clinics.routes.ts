import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const ADMIN_CLINICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/clinic-list-page/clinic-list-page.component').then((m) => m.ClinicListPageComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/clinic-create-page/clinic-create-page.component').then((m) => m.ClinicCreatePageComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/clinic-edit-page/clinic-edit-page.component').then((m) => m.ClinicEditPageComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/clinic-detail-page/clinic-detail-page.component').then((m) => m.ClinicDetailPageComponent),
      },
    ],
  },
];

export const CLINIC_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/clinic-layout.component').then((m) => m.ClinicLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.CLINIC_MANAGER])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard/pages/dashboard-page/dashboard-page.component').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'my-clinic',
        loadComponent: () =>
          import('./pages/clinic-my-clinic-page/clinic-my-clinic-page.component').then((m) => m.ClinicMyClinicPageComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
