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
        path: 'labs/:citySlug/:labSlug',
        loadComponent: () =>
          import('./pages/lab-detail-page/lab-detail-page.component').then(
            (m) => m.LabDetailPageComponent,
          ),
      },
      {
        path: 'surgery/:citySlug/:hospitalSlug',
        loadComponent: () =>
          import('./pages/surgery-hospital-detail-page/surgery-hospital-detail-page.component').then(
            (m) => m.SurgeryHospitalDetailPageComponent,
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
      {
        path: 'labs/:citySlug',
        loadComponent: () =>
          import('./pages/labs-city-page/labs-city-page.component').then(
            (m) => m.LabsCityPageComponent,
          ),
      },
      {
        path: 'surgery/:citySlug',
        loadComponent: () =>
          import('./pages/surgery-city-page/surgery-city-page.component').then(
            (m) => m.SurgeryCityPageComponent,
          ),
      },
      {
        path: 'medicines',
        loadComponent: () =>
          import('./pages/medicines-page/medicines-page.component').then(
            (m) => m.MedicinesPageComponent,
          ),
      },
      {
        path: 'medicines/:citySlug/:pharmacySlug',
        loadComponent: () =>
          import('./pages/pharmacy-detail-page/pharmacy-detail-page.component').then(
            (m) => m.PharmacyDetailPageComponent,
          ),
      },
      {
        path: 'medicines/:citySlug',
        loadComponent: () =>
          import('./pages/medicines-city-page/medicines-city-page.component').then(
            (m) => m.MedicinesCityPageComponent,
          ),
      },
    ],
  },
];
