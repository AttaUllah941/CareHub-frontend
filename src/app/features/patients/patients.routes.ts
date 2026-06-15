import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const ADMIN_PATIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/patient-list-page/patient-list-page.component').then((m) => m.PatientListPageComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/patient-create-page/patient-create-page.component').then((m) => m.PatientCreatePageComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/patient-edit-page/patient-edit-page.component').then((m) => m.PatientEditPageComponent),
      },
      {
        path: ':id/family-members',
        loadComponent: () =>
          import('../family-members/pages/family-members-page/family-members-page.component').then(
            (m) => m.FamilyMembersPageComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/patient-detail-page/patient-detail-page.component').then((m) => m.PatientDetailPageComponent),
      },
    ],
  },
];

export const PATIENT_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/patient-layout.component').then((m) => m.PatientLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.PATIENT])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard/pages/dashboard-page/dashboard-page.component').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/patient-my-profile-page/patient-my-profile-page.component').then(
            (m) => m.PatientMyProfilePageComponent,
          ),
      },
      {
        path: 'family-members',
        loadComponent: () =>
          import('../family-members/pages/family-members-page/family-members-page.component').then(
            (m) => m.FamilyMembersPageComponent,
          ),
      },
      {
        path: 'find-doctors',
        loadComponent: () =>
          import('../doctors/pages/doctor-search-page/doctor-search-page.component').then(
            (m) => m.DoctorSearchPageComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('../appointments/pages/appointment-list-page/appointment-list-page.component').then(
            (m) => m.AppointmentListPageComponent,
          ),
      },
      {
        path: 'consultations',
        loadComponent: () =>
          import('../consultations/pages/consultation-list-page/consultation-list-page.component').then(
            (m) => m.ConsultationListPageComponent,
          ),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('../prescriptions/pages/prescription-list-page/prescription-list-page.component').then(
            (m) => m.PrescriptionListPageComponent,
          ),
      },
      {
        path: 'medical-records',
        loadComponent: () =>
          import('../medical-records/pages/medical-record-list-page/medical-record-list-page.component').then(
            (m) => m.MedicalRecordListPageComponent,
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('../reviews/pages/review-list-page/review-list-page.component').then(
            (m) => m.ReviewListPageComponent,
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../notifications/pages/notification-page/notification-page.component').then(
            (m) => m.NotificationPageComponent,
          ),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('../payments/pages/payment-list-page/payment-list-page.component').then(
            (m) => m.PaymentListPageComponent,
          ),
      },
      {
        path: 'payments/callback/jazzcash',
        loadComponent: () =>
          import('../payments/pages/payment-callback-page/payment-callback-page.component').then(
            (m) => m.PaymentCallbackPageComponent,
          ),
      },
      {
        path: 'payments/callback/easypaisa',
        loadComponent: () =>
          import('../payments/pages/payment-callback-page/payment-callback-page.component').then(
            (m) => m.PaymentCallbackPageComponent,
          ),
      },
      {
        path: 'pharmacy/catalog',
        loadComponent: () =>
          import('../pharmacy/pages/patient-medicine-catalog-page/patient-medicine-catalog-page.component').then(
            (m) => m.PatientMedicineCatalogPageComponent,
          ),
      },
      {
        path: 'pharmacy/orders',
        loadComponent: () =>
          import('../pharmacy/pages/patient-pharmacy-orders-page/patient-pharmacy-orders-page.component').then(
            (m) => m.PatientPharmacyOrdersPageComponent,
          ),
      },
      {
        path: 'pharmacy/upload-prescription',
        loadComponent: () =>
          import('../pharmacy/pages/patient-prescription-upload-page/patient-prescription-upload-page.component').then(
            (m) => m.PatientPrescriptionUploadPageComponent,
          ),
      },
      {
        path: 'lab/book',
        loadComponent: () =>
          import('../lab/pages/patient-lab-book-page/patient-lab-book-page.component').then(
            (m) => m.PatientLabBookPageComponent,
          ),
      },
      {
        path: 'lab/bookings',
        loadComponent: () =>
          import('../lab/pages/patient-lab-bookings-page/patient-lab-bookings-page.component').then(
            (m) => m.PatientLabBookingsPageComponent,
          ),
      },
      {
        path: 'lab/reports',
        loadComponent: () =>
          import('../lab/pages/patient-lab-reports-page/patient-lab-reports-page.component').then(
            (m) => m.PatientLabReportsPageComponent,
          ),
      },
      {
        path: 'chat',
        data: { portal: 'patient' },
        loadComponent: () =>
          import('../chat/pages/chat-page/chat-page.component').then((m) => m.ChatPageComponent),
      },
      {
        path: 'chat/:conversationId',
        data: { portal: 'patient' },
        loadComponent: () =>
          import('../chat/pages/chat-page/chat-page.component').then((m) => m.ChatPageComponent),
      },
      {
        path: 'video/:appointmentId',
        data: { portal: 'patient' },
        loadComponent: () =>
          import('../video-consultations/pages/video-consultation-room-page/video-consultation-room-page.component').then(
            (m) => m.VideoConsultationRoomPageComponent,
          ),
      },
      {
        path: 'appointments/book/:doctorId',
        loadComponent: () =>
          import('../appointments/pages/appointment-book-page/appointment-book-page.component').then(
            (m) => m.AppointmentBookPageComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
