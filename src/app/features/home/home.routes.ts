import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'find-doctors/:specialtySlug',
        loadComponent: () =>
          import('./pages/find-doctors-page/find-doctors-page.component').then(
            (m) => m.FindDoctorsPageComponent,
          ),
      },
      {
        path: 'hospitals/:citySlug/:hospitalSlug',
        loadComponent: () =>
          import('./pages/hospital-detail-page/hospital-detail-page.component').then(
            (m) => m.HospitalDetailPageComponent,
          ),
      },
      {
        path: 'doctors/:doctorId',
        loadComponent: () =>
          import('./pages/doctor-detail-page/doctor-detail-page.component').then(
            (m) => m.DoctorDetailPageComponent,
          ),
      },
      {
        path: 'hospitals/:citySlug',
        loadComponent: () =>
          import('./pages/hospitals-city-page/hospitals-city-page.component').then(
            (m) => m.HospitalsCityPageComponent,
          ),
      },
    ],
  },
];
