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
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
