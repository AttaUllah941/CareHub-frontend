import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/role-list-page/role-list-page.component').then((m) => m.RoleListPageComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/role-create-page/role-create-page.component').then((m) => m.RoleCreatePageComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/role-edit-page/role-edit-page.component').then((m) => m.RoleEditPageComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/role-detail-page/role-detail-page.component').then((m) => m.RoleDetailPageComponent),
      },
    ],
  },
];

export const PERMISSIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/permission-list-page/permission-list-page.component').then(
            (m) => m.PermissionListPageComponent,
          ),
      },
    ],
  },
];
