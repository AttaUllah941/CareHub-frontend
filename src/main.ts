import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

/**
 * Wake a sleeping API host (e.g. Render free) before Angular finishes bootstrapping.
 * Only hits /health — cheap and enough to start the dyno. Specialties load once via
 * ReferenceDataService (localStorage SWR + shareReplay) to avoid a discarded duplicate fetch.
 */
function wakeApiHostEarly(): void {
  if (typeof fetch === 'undefined') return;

  const socketBase = (environment.socketUrl || '').replace(/\/$/, '');
  const apiBase = (environment.apiUrl || '').replace(/\/$/, '');
  const origin =
    socketBase ||
    (apiBase.endsWith('/api/v1') ? apiBase.slice(0, -'/api/v1'.length) : apiBase);

  if (!origin || /localhost|127\.0\.0\.1/i.test(origin)) return;

  void fetch(`${origin}/health`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
  }).catch(() => undefined);
}

wakeApiHostEarly();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
