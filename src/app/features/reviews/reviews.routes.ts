import { Routes } from '@angular/router';

export const ADMIN_REVIEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-review-list-page/admin-review-list-page.component').then(
        (m) => m.AdminReviewListPageComponent,
      ),
  },
];
