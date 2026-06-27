import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'find-doctors/:specialtySlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'hospitals/:citySlug/:hospitalSlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'doctors/:doctorId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'hospitals/:citySlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'labs/:citySlug/:labSlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'labs/:citySlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'surgery/:citySlug/:hospitalSlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'surgery/:citySlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'medicines/cart',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'medicines/checkout',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'medicines/orders/:orderId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'medicines/orders',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'medicines/:citySlug/:pharmacySlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'medicines/:citySlug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'medicines',
    renderMode: RenderMode.Server,
  },
  {
    path: 'join-as-doctor',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'doctor/login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'doctor/**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'consultation/**',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
