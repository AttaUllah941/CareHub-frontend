import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Bootstrap only. Production API wake runs from the earliest inline script in
 * index.html so we do not issue a duplicate /health request that contends with
 * session + reference-data calls on a cold host.
 */
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
