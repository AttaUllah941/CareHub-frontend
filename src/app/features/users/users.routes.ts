import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/user-list-page/user-list-page.component').then(
            (m) => m.UserListPageComponent,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/user-create-page/user-create-page.component').then(
            (m) => m.UserCreatePageComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/user-edit-page/user-edit-page.component').then(
            (m) => m.UserEditPageComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/user-detail-page/user-detail-page.component').then(
            (m) => m.UserDetailPageComponent,
          ),
      },
    ],
  },
];
