import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateLanguageRequest,
  LanguageListQuery,
  UpdateLanguageRequest,
} from '../../../core/models/language.model';
import { LanguagesActions } from '../store/languages.actions';
import {
  selectAllLanguages,
  selectLanguages,
  selectLanguagesError,
  selectLanguagesLoading,
  selectLanguagesPagination,
  selectLanguagesQuery,
  selectLanguagesSaving,
  selectLanguagesSuccessMessage,
  selectSelectedLanguage,
} from '../store/languages.selectors';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly store = inject(Store);

  readonly languages = this.store.selectSignal(selectLanguages);
  readonly allLanguages = this.store.selectSignal(selectAllLanguages);
  readonly selectedLanguage = this.store.selectSignal(selectSelectedLanguage);
  readonly pagination = this.store.selectSignal(selectLanguagesPagination);
  readonly query = this.store.selectSignal(selectLanguagesQuery);
  readonly loading = this.store.selectSignal(selectLanguagesLoading);
  readonly saving = this.store.selectSignal(selectLanguagesSaving);
  readonly error = this.store.selectSignal(selectLanguagesError);
  readonly successMessage = this.store.selectSignal(selectLanguagesSuccessMessage);

  loadLanguages(query?: Partial<LanguageListQuery>): void {
    this.store.dispatch(LanguagesActions.loadLanguages({ query }));
  }

  loadAllLanguages(): void {
    this.store.dispatch(LanguagesActions.loadAllLanguages());
  }

  loadLanguage(id: string): void {
    this.store.dispatch(LanguagesActions.loadLanguage({ id }));
  }

  createLanguage(payload: CreateLanguageRequest): void {
    this.store.dispatch(LanguagesActions.createLanguage({ payload }));
  }

  updateLanguage(id: string, payload: UpdateLanguageRequest): void {
    this.store.dispatch(LanguagesActions.updateLanguage({ id, payload }));
  }

  deleteLanguage(id: string): void {
    this.store.dispatch(LanguagesActions.deleteLanguage({ id }));
  }

  clearError(): void {
    this.store.dispatch(LanguagesActions.clearError());
  }

  clearSuccessMessage(): void {
    this.store.dispatch(LanguagesActions.clearSuccessMessage());
  }
}
