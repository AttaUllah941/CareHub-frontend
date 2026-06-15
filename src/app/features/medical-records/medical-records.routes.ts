import { Routes } from '@angular/router';

export const ADMIN_MEDICAL_RECORDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-medical-record-list-page/admin-medical-record-list-page.component').then(
        (m) => m.AdminMedicalRecordListPageComponent,
      ),
  },
];
