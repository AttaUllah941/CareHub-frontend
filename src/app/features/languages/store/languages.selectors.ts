import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LANGUAGES_FEATURE_KEY, LanguagesState } from './languages.state';

export const selectLanguagesState = createFeatureSelector<LanguagesState>(LANGUAGES_FEATURE_KEY);

export const selectLanguages = createSelector(selectLanguagesState, (s) => s.languages);
export const selectAllLanguages = createSelector(selectLanguagesState, (s) => s.allLanguages);
export const selectSelectedLanguage = createSelector(selectLanguagesState, (s) => s.selectedLanguage);
export const selectLanguagesPagination = createSelector(selectLanguagesState, (s) => s.pagination);
export const selectLanguagesQuery = createSelector(selectLanguagesState, (s) => s.query);
export const selectLanguagesLoading = createSelector(selectLanguagesState, (s) => s.loading);
export const selectLanguagesSaving = createSelector(selectLanguagesState, (s) => s.saving);
export const selectLanguagesError = createSelector(selectLanguagesState, (s) => s.error);
export const selectLanguagesSuccessMessage = createSelector(selectLanguagesState, (s) => s.successMessage);
