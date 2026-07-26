import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { AUTH_FEATURE_KEY } from './features/auth/store/auth.state';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';

/** Passthrough loader so NgOptimizedImage accepts absolute CDN/API image URLs. */
const absoluteUrlImageLoader = (config: ImageLoaderConfig): string => config.src;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Zone.js is not a dependency — lock in zoneless CD for Angular 21.
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideClientHydration(
      withEventReplay(),
      // SSR GET responses hydrate on the client (skip auth-header requests).
      withHttpTransferCacheOptions({
        includeRequestsWithAuthHeaders: false,
      }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
        errorInterceptor,
        apiErrorInterceptor,
      ]),
    ),
    { provide: IMAGE_LOADER, useValue: absoluteUrlImageLoader },
    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
    }),
    provideEffects([AuthEffects]),
    // Keep NgRx DevTools out of production bundles.
    ...(isDevMode()
      ? [provideStoreDevtools({ maxAge: 25, logOnly: false })]
      : []),
  ],
};
