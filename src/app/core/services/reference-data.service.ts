import { Injectable, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, Observable, of, shareReplay, tap } from 'rxjs';
import { SpecialtyChip } from '../models/catalog.model';
import { Language } from '../models/language.model';
import { MedicalSpecialty } from '../models/medical-specialty.model';
import { ApiResponse } from '../models/api.model';
import {
  formatSlugAsTitle,
  pluralizeSpecialtyTitle,
  resolveSpecialtyIcon,
} from '../utils/specialty-display.util';
import {
  isReferenceCacheFresh,
  LANGUAGES_CACHE_KEY,
  readReferenceCache,
  SPECIALTIES_CACHE_KEY,
  writeReferenceCache,
} from '../utils/reference-data-cache.util';
import { LanguageApiService } from './language-api.service';
import { SpecialtyApiService } from './specialty-api.service';

/**
 * Shared public reference data (specialties, languages).
 * - Hydrates instantly from localStorage when available (stale-while-revalidate).
 * - Deduplicates in-flight HTTP with shareReplay.
 * - Skips network when a fresh cache entry exists.
 */
@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  private readonly specialtyApi = inject(SpecialtyApiService);
  private readonly languageApi = inject(LanguageApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly specialties = signal<MedicalSpecialty[]>([]);
  private readonly languages = signal<Language[]>([]);
  private readonly specialtiesLoading = signal(false);
  private readonly languagesLoading = signal(false);
  private readonly specialtiesError = signal<string | null>(null);
  private readonly languagesError = signal<string | null>(null);
  private readonly specialtiesLoaded = signal(false);
  private readonly languagesLoaded = signal(false);

  /** True after a successful network response this session (or fresh disk cache). */
  private specialtiesNetworkSettled = false;
  private languagesNetworkSettled = false;

  private specialtiesInFlight: Observable<ApiResponse<{
    specialties: MedicalSpecialty[];
  }> | null> | null = null;

  private languagesInFlight: Observable<ApiResponse<{
    languages: Language[];
  }> | null> | null = null;

  readonly specialtyList = this.specialties.asReadonly();
  readonly languageList = this.languages.asReadonly();
  readonly specialtiesLoadingState = this.specialtiesLoading.asReadonly();
  readonly languagesLoadingState = this.languagesLoading.asReadonly();
  readonly specialtiesErrorState = this.specialtiesError.asReadonly();
  readonly languagesErrorState = this.languagesError.asReadonly();
  readonly specialtiesLoadedState = this.specialtiesLoaded.asReadonly();
  readonly languagesLoadedState = this.languagesLoaded.asReadonly();

  /** True until we have something to show (cache or network). */
  readonly specialtiesPending = computed(
    () => !this.specialtiesLoaded() && !this.specialtiesError(),
  );

  readonly specialtyChips = computed<SpecialtyChip[]>(() =>
    this.specialties().map((specialty) => ({
      id: specialty.id,
      name: specialty.name,
      slug: specialty.slug,
      icon: resolveSpecialtyIcon(specialty.icon),
      description: specialty.description,
    })),
  );

  constructor() {
    this.hydrateFromCache();
  }

  /** Load specialties now; languages can wait until a feature needs them. */
  loadCritical(): void {
    this.loadSpecialties();
  }

  /** @deprecated Prefer loadCritical() + loadLanguages() on demand. */
  loadAll(): void {
    this.loadSpecialties();
    this.loadLanguages();
  }

  loadSpecialties(force = false): void {
    if (!this.isBrowser) return;

    if (!force && this.specialtiesNetworkSettled && this.specialtiesLoaded()) {
      return;
    }

    if (
      !force &&
      this.specialtiesLoaded() &&
      isReferenceCacheFresh(this.platformId, SPECIALTIES_CACHE_KEY)
    ) {
      this.specialtiesNetworkSettled = true;
      return;
    }

    if (this.specialtiesInFlight) {
      this.specialtiesInFlight.subscribe();
      return;
    }

    const showBlockingLoader = !this.specialtiesLoaded();
    if (showBlockingLoader) {
      this.specialtiesLoading.set(true);
    }
    this.specialtiesError.set(null);

    this.specialtiesInFlight = this.specialtyApi.listPublic().pipe(
      tap((response) => {
        const active = response.data.specialties.filter((item) => item.isActive);
        this.specialties.set(active);
        this.specialtiesLoaded.set(true);
        this.specialtiesNetworkSettled = true;
        this.specialtiesError.set(null);
        writeReferenceCache(this.platformId, SPECIALTIES_CACHE_KEY, active);
      }),
      catchError(() => {
        if (!this.specialtiesLoaded()) {
          this.specialtiesError.set('Unable to load medical specialties.');
        }
        return of(null);
      }),
      finalize(() => {
        this.specialtiesLoading.set(false);
        this.specialtiesInFlight = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.specialtiesInFlight.subscribe();
  }

  loadLanguages(force = false): void {
    if (!this.isBrowser) return;

    if (!force && this.languagesNetworkSettled && this.languagesLoaded()) {
      return;
    }

    if (
      !force &&
      this.languagesLoaded() &&
      isReferenceCacheFresh(this.platformId, LANGUAGES_CACHE_KEY)
    ) {
      this.languagesNetworkSettled = true;
      return;
    }

    if (this.languagesInFlight) {
      this.languagesInFlight.subscribe();
      return;
    }

    const showBlockingLoader = !this.languagesLoaded();
    if (showBlockingLoader) {
      this.languagesLoading.set(true);
    }
    this.languagesError.set(null);

    this.languagesInFlight = this.languageApi.listPublic().pipe(
      tap((response) => {
        const active = response.data.languages.filter((item) => item.isActive);
        this.languages.set(active);
        this.languagesLoaded.set(true);
        this.languagesNetworkSettled = true;
        this.languagesError.set(null);
        writeReferenceCache(this.platformId, LANGUAGES_CACHE_KEY, active);
      }),
      catchError(() => {
        if (!this.languagesLoaded()) {
          this.languagesError.set('Unable to load languages.');
        }
        return of(null);
      }),
      finalize(() => {
        this.languagesLoading.set(false);
        this.languagesInFlight = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.languagesInFlight.subscribe();
  }

  getSpecialtyName(slug: string): string {
    const match = this.specialties().find((item) => item.slug === slug);
    return match?.name ?? formatSlugAsTitle(slug);
  }

  getSpecialtyPluralTitle(slug: string): string {
    return pluralizeSpecialtyTitle(this.getSpecialtyName(slug));
  }

  getLanguageName(code: string): string {
    const match = this.languages().find((item) => item.code === code);
    return match?.name ?? code.toUpperCase();
  }

  private hydrateFromCache(): void {
    if (!this.isBrowser) return;

    const cachedSpecialties = readReferenceCache<MedicalSpecialty[]>(
      this.platformId,
      SPECIALTIES_CACHE_KEY,
    );
    if (cachedSpecialties?.length) {
      this.specialties.set(cachedSpecialties.filter((item) => item.isActive !== false));
      this.specialtiesLoaded.set(true);
      if (isReferenceCacheFresh(this.platformId, SPECIALTIES_CACHE_KEY)) {
        this.specialtiesNetworkSettled = true;
      }
    }

    const cachedLanguages = readReferenceCache<Language[]>(
      this.platformId,
      LANGUAGES_CACHE_KEY,
    );
    if (cachedLanguages?.length) {
      this.languages.set(cachedLanguages.filter((item) => item.isActive !== false));
      this.languagesLoaded.set(true);
      if (isReferenceCacheFresh(this.platformId, LANGUAGES_CACHE_KEY)) {
        this.languagesNetworkSettled = true;
      }
    }
  }
}
