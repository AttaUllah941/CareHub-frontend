import { Routes } from '@angular/router';

export const ADMIN_PAYMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-payment-list-page/admin-payment-list-page.component').then(
        (m) => m.AdminPaymentListPageComponent,
      ),
  },
];
