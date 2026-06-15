import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const MEDICAL_SPECIALTIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/medical-specialty-list-page/medical-specialty-list-page.component').then(
            (m) => m.MedicalSpecialtyListPageComponent,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/medical-specialty-create-page/medical-specialty-create-page.component').then(
            (m) => m.MedicalSpecialtyCreatePageComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/medical-specialty-edit-page/medical-specialty-edit-page.component').then(
            (m) => m.MedicalSpecialtyEditPageComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/medical-specialty-detail-page/medical-specialty-detail-page.component').then(
            (m) => m.MedicalSpecialtyDetailPageComponent,
          ),
      },
    ],
  },
];
