import { Routes } from '@angular/router';

export const ADMIN_NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-notification-list-page/admin-notification-list-page.component').then(
        (m) => m.AdminNotificationListPageComponent,
      ),
  },
];
