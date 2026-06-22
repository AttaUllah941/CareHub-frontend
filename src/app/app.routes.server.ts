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
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
