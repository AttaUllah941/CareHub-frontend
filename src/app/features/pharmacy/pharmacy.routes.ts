import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

const pharmacyStaff = [UserRole.PHARMACY, UserRole.SUPER_ADMIN, UserRole.ADMIN];

export const ADMIN_PHARMACY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard(pharmacyStaff)],
    children: [
      {
        path: 'medicines',
        loadComponent: () =>
          import('./pages/admin-medicine-list-page/admin-medicine-list-page.component').then(
            (m) => m.AdminMedicineListPageComponent,
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/admin-inventory-page/admin-inventory-page.component').then(
            (m) => m.AdminInventoryPageComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin-pharmacy-orders-page/admin-pharmacy-orders-page.component').then(
            (m) => m.AdminPharmacyOrdersPageComponent,
          ),
      },
      {
        path: 'prescription-uploads',
        loadComponent: () =>
          import('./pages/admin-prescription-uploads-page/admin-prescription-uploads-page.component').then(
            (m) => m.AdminPrescriptionUploadsPageComponent,
          ),
      },
      { path: '', redirectTo: 'medicines', pathMatch: 'full' },
    ],
  },
];

export const PHARMACY_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/pharmacy-layout.component').then((m) => m.PharmacyLayoutComponent),
    canActivate: [authGuard, roleGuard(pharmacyStaff)],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/pharmacy-dashboard-page/pharmacy-dashboard-page.component').then(
            (m) => m.PharmacyDashboardPageComponent,
          ),
      },
      {
        path: 'medicines',
        loadComponent: () =>
          import('./pages/admin-medicine-list-page/admin-medicine-list-page.component').then(
            (m) => m.AdminMedicineListPageComponent,
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/admin-inventory-page/admin-inventory-page.component').then(
            (m) => m.AdminInventoryPageComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin-pharmacy-orders-page/admin-pharmacy-orders-page.component').then(
            (m) => m.AdminPharmacyOrdersPageComponent,
          ),
      },
      {
        path: 'prescription-uploads',
        loadComponent: () =>
          import('./pages/admin-prescription-uploads-page/admin-prescription-uploads-page.component').then(
            (m) => m.AdminPrescriptionUploadsPageComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
