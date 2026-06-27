import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/errors/pages/unauthorized-page/unauthorized-page.component').then(
        (m) => m.UnauthorizedPageComponent,
      ),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./features/doctor-portal/doctor.routes').then((m) => m.DOCTOR_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
];
