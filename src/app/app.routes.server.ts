import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/users/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/users/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/roles/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/roles/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/medical-specialties/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/medical-specialties/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/languages/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/languages/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/doctors/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/doctors/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/clinics/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/clinics/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/patients/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/patients/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/patients/:id/family-members',
    renderMode: RenderMode.Server,
  },
  {
    path: 'patient/appointments/book/:doctorId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'patient/video/:appointmentId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'doctor/video/:appointmentId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'patient/chat/:conversationId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'doctor/chat/:conversationId',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
