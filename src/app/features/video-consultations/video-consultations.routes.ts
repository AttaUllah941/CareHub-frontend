import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/auth.model';

export const PATIENT_VIDEO_ROUTES: Routes = [
  {
    path: 'video/:appointmentId',
    canActivate: [authGuard, roleGuard([UserRole.PATIENT])],
    data: { portal: 'patient' },
    loadComponent: () =>
      import('./pages/video-consultation-room-page/video-consultation-room-page.component').then(
        (m) => m.VideoConsultationRoomPageComponent,
      ),
  },
];

export const DOCTOR_VIDEO_ROUTES: Routes = [
  {
    path: 'video/:appointmentId',
    canActivate: [authGuard, roleGuard([UserRole.DOCTOR])],
    data: { portal: 'doctor' },
    loadComponent: () =>
      import('./pages/video-consultation-room-page/video-consultation-room-page.component').then(
        (m) => m.VideoConsultationRoomPageComponent,
      ),
  },
];
