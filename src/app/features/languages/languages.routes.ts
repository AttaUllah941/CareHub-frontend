import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const LANGUAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/language-list-page/language-list-page.component').then(
            (m) => m.LanguageListPageComponent,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/language-create-page/language-create-page.component').then(
            (m) => m.LanguageCreatePageComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/language-edit-page/language-edit-page.component').then(
            (m) => m.LanguageEditPageComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/language-detail-page/language-detail-page.component').then(
            (m) => m.LanguageDetailPageComponent,
          ),
      },
    ],
  },
];
