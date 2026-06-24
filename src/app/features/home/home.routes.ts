import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'join-as-doctor',
        loadComponent: () =>
          import('../doctor-onboarding/pages/doctor-register-page/doctor-register-page.component').then(
            (m) => m.DoctorRegisterPageComponent,
          ),
      },
      {
        path: 'find-doctors/:specialtySlug',
        loadComponent: () =>
          import('../doctors/pages/find-doctors-page/find-doctors-page.component').then(
            (m) => m.FindDoctorsPageComponent,
          ),
      },
      {
        path: 'hospitals/:citySlug/:hospitalSlug',
        loadComponent: () =>
          import('../hospitals/pages/hospital-detail-page/hospital-detail-page.component').then(
            (m) => m.HospitalDetailPageComponent,
          ),
      },
      {
        path: 'labs/:citySlug/:labSlug',
        loadComponent: () =>
          import('../labs/pages/lab-detail-page/lab-detail-page.component').then(
            (m) => m.LabDetailPageComponent,
          ),
      },
      {
        path: 'surgery/:citySlug/:hospitalSlug',
        loadComponent: () =>
          import('../surgeries/pages/surgery-hospital-detail-page/surgery-hospital-detail-page.component').then(
            (m) => m.SurgeryHospitalDetailPageComponent,
          ),
      },
      {
        path: 'doctors/:doctorId',
        loadComponent: () =>
          import('../doctors/pages/doctor-detail-page/doctor-detail-page.component').then(
            (m) => m.DoctorDetailPageComponent,
          ),
      },
      {
        path: 'hospitals/:citySlug',
        loadComponent: () =>
          import('../hospitals/pages/hospitals-city-page/hospitals-city-page.component').then(
            (m) => m.HospitalsCityPageComponent,
          ),
      },
      {
        path: 'labs/:citySlug',
        loadComponent: () =>
          import('../labs/pages/labs-city-page/labs-city-page.component').then(
            (m) => m.LabsCityPageComponent,
          ),
      },
      {
        path: 'surgery/:citySlug',
        loadComponent: () =>
          import('../surgeries/pages/surgery-city-page/surgery-city-page.component').then(
            (m) => m.SurgeryCityPageComponent,
          ),
      },
      {
        path: 'medicines/cart',
        loadComponent: () =>
          import('../medicines/pages/medicine-cart-page/medicine-cart-page.component').then(
            (m) => m.MedicineCartPageComponent,
          ),
      },
      {
        path: 'medicines/checkout',
        loadComponent: () =>
          import('../medicines/pages/medicine-checkout-page/medicine-checkout-page.component').then(
            (m) => m.MedicineCheckoutPageComponent,
          ),
      },
      {
        path: 'medicines/orders/:orderId',
        loadComponent: () =>
          import('../medicines/pages/medicine-order-detail-page/medicine-order-detail-page.component').then(
            (m) => m.MedicineOrderDetailPageComponent,
          ),
      },
      {
        path: 'medicines/orders',
        loadComponent: () =>
          import('../medicines/pages/medicine-orders-page/medicine-orders-page.component').then(
            (m) => m.MedicineOrdersPageComponent,
          ),
      },
      {
        path: 'medicines',
        loadComponent: () =>
          import('../medicines/pages/medicines-page/medicines-page.component').then(
            (m) => m.MedicinesPageComponent,
          ),
      },
      {
        path: 'medicines/:citySlug/:pharmacySlug',
        loadComponent: () =>
          import('../medicines/pages/pharmacy-detail-page/pharmacy-detail-page.component').then(
            (m) => m.PharmacyDetailPageComponent,
          ),
      },
      {
        path: 'medicines/:citySlug',
        loadComponent: () =>
          import('../medicines/pages/medicines-city-page/medicines-city-page.component').then(
            (m) => m.MedicinesCityPageComponent,
          ),
      },
    ],
  },
];
