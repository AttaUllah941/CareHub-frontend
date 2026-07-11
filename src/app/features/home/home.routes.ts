import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { patientGuard } from '../../core/guards/role.guard';

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
        path: 'health-advice',
        loadComponent: () =>
          import('./pages/health-advice-page/health-advice-page.component').then(
            (m) => m.HealthAdvicePageComponent,
          ),
      },
      {
        path: 'symptoms',
        loadComponent: () =>
          import('./pages/symptoms-page/symptoms-page.component').then(
            (m) => m.SymptomsPageComponent,
          ),
      },
      {
        path: 'diseases',
        loadComponent: () =>
          import('./pages/diseases-page/diseases-page.component').then(
            (m) => m.DiseasesPageComponent,
          ),
      },
      {
        path: 'terms',
        loadComponent: () =>
          import('./pages/terms-page/terms-page.component').then((m) => m.TermsPageComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about-page/about-page.component').then((m) => m.AboutPageComponent),
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
        path: 'my-appointments',
        canActivate: [authGuard, patientGuard],
        loadComponent: () =>
          import('../appointments/pages/my-appointments-page/my-appointments-page.component').then(
            (m) => m.MyAppointmentsPageComponent,
          ),
      },
      {
        path: 'my-lab-tests',
        canActivate: [authGuard, patientGuard],
        loadComponent: () =>
          import('../labs/pages/my-lab-tests-page/my-lab-tests-page.component').then(
            (m) => m.MyLabTestsPageComponent,
          ),
      },
      {
        path: 'my-prescriptions',
        canActivate: [authGuard, patientGuard],
        loadComponent: () =>
          import('../appointments/pages/my-prescriptions-page/my-prescriptions-page.component').then(
            (m) => m.MyPrescriptionsPageComponent,
          ),
      },
      {
        path: 'my-surgery-requests',
        canActivate: [authGuard, patientGuard],
        loadComponent: () =>
          import('../surgeries/pages/my-surgery-requests-page/my-surgery-requests-page.component').then(
            (m) => m.MySurgeryRequestsPageComponent,
          ),
      },
      {
        path: 'consultation/:roomRef',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../appointments/pages/video-consultation-room-page/video-consultation-room-page.component').then(
            (m) => m.VideoConsultationRoomPageComponent,
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
