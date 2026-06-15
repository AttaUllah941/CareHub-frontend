import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const ADMIN_DOCTORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../users/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/doctor-list-page/doctor-list-page.component').then((m) => m.DoctorListPageComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/doctor-create-page/doctor-create-page.component').then((m) => m.DoctorCreatePageComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/doctor-edit-page/doctor-edit-page.component').then((m) => m.DoctorEditPageComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/doctor-profile-page/doctor-profile-page.component').then((m) => m.DoctorProfilePageComponent),
      },
    ],
  },
];

export const DOCTOR_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/doctor-layout.component').then((m) => m.DoctorLayoutComponent),
    canActivate: [authGuard, roleGuard([UserRole.DOCTOR])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/doctor-dashboard-page/doctor-dashboard-page.component').then(
            (m) => m.DoctorDashboardPageComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/doctor-my-profile-page/doctor-my-profile-page.component').then(
            (m) => m.DoctorMyProfilePageComponent,
          ),
      },
      {
        path: 'availability',
        loadComponent: () =>
          import('../doctor-availability/pages/doctor-availability-page/doctor-availability-page.component').then(
            (m) => m.DoctorAvailabilityPageComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('../appointments/pages/doctor-appointment-list-page/doctor-appointment-list-page.component').then(
            (m) => m.DoctorAppointmentListPageComponent,
          ),
      },
      {
        path: 'consultations',
        loadComponent: () =>
          import('../consultations/pages/doctor-consultation-list-page/doctor-consultation-list-page.component').then(
            (m) => m.DoctorConsultationListPageComponent,
          ),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('../prescriptions/pages/doctor-prescription-list-page/doctor-prescription-list-page.component').then(
            (m) => m.DoctorPrescriptionListPageComponent,
          ),
      },
      {
        path: 'medical-records',
        loadComponent: () =>
          import('../medical-records/pages/doctor-medical-record-list-page/doctor-medical-record-list-page.component').then(
            (m) => m.DoctorMedicalRecordListPageComponent,
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('../reviews/pages/doctor-review-list-page/doctor-review-list-page.component').then(
            (m) => m.DoctorReviewListPageComponent,
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
        path: 'video/:appointmentId',
        data: { portal: 'doctor' },
        loadComponent: () =>
          import('../video-consultations/pages/video-consultation-room-page/video-consultation-room-page.component').then(
            (m) => m.VideoConsultationRoomPageComponent,
          ),
      },
      {
        path: 'chat',
        data: { portal: 'doctor' },
        loadComponent: () =>
          import('../chat/pages/chat-page/chat-page.component').then((m) => m.ChatPageComponent),
      },
      {
        path: 'chat/:conversationId',
        data: { portal: 'doctor' },
        loadComponent: () =>
          import('../chat/pages/chat-page/chat-page.component').then((m) => m.ChatPageComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
