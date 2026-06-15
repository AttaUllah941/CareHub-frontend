import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

const labStaff = [UserRole.LAB, UserRole.SUPER_ADMIN, UserRole.ADMIN];

export const ADMIN_LAB_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard(labStaff)],
    children: [
      { path: 'labs', loadComponent: () => import('./pages/admin-lab-list-page/admin-lab-list-page.component').then((m) => m.AdminLabListPageComponent) },
      { path: 'tests', loadComponent: () => import('./pages/admin-lab-tests-page/admin-lab-tests-page.component').then((m) => m.AdminLabTestsPageComponent) },
      { path: 'bookings', loadComponent: () => import('./pages/admin-lab-bookings-page/admin-lab-bookings-page.component').then((m) => m.AdminLabBookingsPageComponent) },
      { path: 'reports', loadComponent: () => import('./pages/admin-lab-reports-page/admin-lab-reports-page.component').then((m) => m.AdminLabReportsPageComponent) },
      { path: '', redirectTo: 'labs', pathMatch: 'full' },
    ],
  },
];

export const LAB_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/lab-layout.component').then((m) => m.LabLayoutComponent),
    canActivate: [authGuard, roleGuard(labStaff)],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/lab-dashboard-page/lab-dashboard-page.component').then((m) => m.LabDashboardPageComponent) },
      { path: 'labs', loadComponent: () => import('./pages/admin-lab-list-page/admin-lab-list-page.component').then((m) => m.AdminLabListPageComponent) },
      { path: 'tests', loadComponent: () => import('./pages/admin-lab-tests-page/admin-lab-tests-page.component').then((m) => m.AdminLabTestsPageComponent) },
      { path: 'bookings', loadComponent: () => import('./pages/admin-lab-bookings-page/admin-lab-bookings-page.component').then((m) => m.AdminLabBookingsPageComponent) },
      { path: 'reports', loadComponent: () => import('./pages/admin-lab-reports-page/admin-lab-reports-page.component').then((m) => m.AdminLabReportsPageComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
