import { Injectable, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { SpecialtyChip } from '../models/catalog.model';
import { Language } from '../models/language.model';
import { MedicalSpecialty } from '../models/medical-specialty.model';
import {
  formatSlugAsTitle,
  pluralizeSpecialtyTitle,
  resolveSpecialtyIcon,
} from '../utils/specialty-display.util';
import { LanguageApiService } from './language-api.service';
import { SpecialtyApiService } from './specialty-api.service';

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

  private languagesLoaded = false;

  readonly specialtyList = this.specialties.asReadonly();
  readonly languageList = this.languages.asReadonly();
  readonly specialtiesLoadingState = this.specialtiesLoading.asReadonly();
  readonly languagesLoadingState = this.languagesLoading.asReadonly();
  readonly specialtiesErrorState = this.specialtiesError.asReadonly();
  readonly languagesErrorState = this.languagesError.asReadonly();

  readonly specialtyChips = computed<SpecialtyChip[]>(() =>
    this.specialties().map((specialty) => ({
      id: specialty.id,
      name: specialty.name,
      slug: specialty.slug,
      icon: resolveSpecialtyIcon(specialty.icon),
      description: specialty.description,
    })),
  );

  loadAll(): void {
    this.loadSpecialties();
    this.loadLanguages();
  }

  loadSpecialties(): void {
    if (!this.isBrowser) return;
    if (this.specialtiesLoading()) return;

    this.specialtiesLoading.set(true);
    this.specialtiesError.set(null);

    this.specialtyApi
      .listPublic()
      .pipe(
        tap((response) => {
          this.specialties.set(response.data.specialties.filter((item) => item.isActive));
          this.specialtiesLoading.set(false);
        }),
        catchError(() => {
          this.specialtiesError.set('Unable to load medical specialties.');
          this.specialtiesLoading.set(false);
          return of(null);
        }),
      )
      .subscribe();
  }

  loadLanguages(force = false): void {
    if (!this.isBrowser) return;
    if (this.languagesLoaded && !force) return;

    this.languagesLoading.set(true);
    this.languagesError.set(null);

    this.languageApi
      .listPublic()
      .pipe(
        tap((response) => {
          this.languages.set(response.data.languages.filter((item) => item.isActive));
          this.languagesLoaded = true;
          this.languagesLoading.set(false);
        }),
        catchError(() => {
          this.languagesError.set('Unable to load languages.');
          this.languagesLoading.set(false);
          return of(null);
        }),
      )
      .subscribe();
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
}
