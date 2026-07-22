import { Routes } from '@angular/router';
import { pharmacyPortalGuard } from '../../core/guards/role.guard';

export const PHARMACY_ROUTES: Routes = [
  {
    path: '',
    canActivate: [pharmacyPortalGuard],
    loadComponent: () =>
      import('../../layouts/pharmacy-layout/pharmacy-layout.component').then(
        (m) => m.PharmacyLayoutComponent,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'orders' },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/pharmacy-orders-page/pharmacy-orders-page.component').then(
            (m) => m.PharmacyOrdersPageComponent,
          ),
      },
      {
        path: 'orders/:orderId',
        loadComponent: () =>
          import('./pages/pharmacy-order-detail-page/pharmacy-order-detail-page.component').then(
            (m) => m.PharmacyOrderDetailPageComponent,
          ),
      },
    ],
  },
];
