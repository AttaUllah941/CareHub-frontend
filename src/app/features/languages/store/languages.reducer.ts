import { createReducer, on } from '@ngrx/store';
import { DEFAULT_LANGUAGE_LIST_QUERY } from '../../../core/models/language.model';
import { LanguagesActions } from './languages.actions';
import { initialLanguagesState } from './languages.state';

const setSaving = (state: typeof initialLanguagesState) => ({
  ...state,
  saving: true,
  error: null,
  successMessage: null,
});

const setFailure = (state: typeof initialLanguagesState, { error }: { error: string }) => ({
  ...state,
  loading: false,
  saving: false,
  error,
});

export const languagesReducer = createReducer(
  initialLanguagesState,

  on(LanguagesActions.loadLanguages, (state, { query }) => ({
    ...state,
    loading: true,
    error: null,
    query: { ...DEFAULT_LANGUAGE_LIST_QUERY, ...state.query, ...query },
  })),
  on(LanguagesActions.loadLanguagesSuccess, (state, { languages, pagination, query }) => ({
    ...state,
    languages,
    pagination,
    query,
    loading: false,
  })),
  on(LanguagesActions.loadLanguagesFailure, setFailure),

  on(LanguagesActions.loadAllLanguages, (state) => ({ ...state, loading: true })),
  on(LanguagesActions.loadAllLanguagesSuccess, (state, { languages }) => ({
    ...state,
    allLanguages: languages,
    loading: false,
  })),
  on(LanguagesActions.loadAllLanguagesFailure, setFailure),

  on(LanguagesActions.loadLanguage, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedLanguage: null,
  })),
  on(LanguagesActions.loadLanguageSuccess, (state, { language }) => ({
    ...state,
    selectedLanguage: language,
    loading: false,
  })),
  on(LanguagesActions.loadLanguageFailure, setFailure),

  on(
    LanguagesActions.createLanguage,
    LanguagesActions.updateLanguage,
    LanguagesActions.deleteLanguage,
    setSaving,
  ),

  on(LanguagesActions.createLanguageSuccess, LanguagesActions.updateLanguageSuccess, (state, { language, message }) => ({
    ...state,
    selectedLanguage: language,
    saving: false,
    successMessage: message,
    languages: state.languages.some((l) => l.id === language.id)
      ? state.languages.map((l) => (l.id === language.id ? language : l))
      : state.languages,
  })),

  on(LanguagesActions.deleteLanguageSuccess, (state, { message }) => ({
    ...state,
    saving: false,
    successMessage: message,
  })),

  on(
    LanguagesActions.createLanguageFailure,
    LanguagesActions.updateLanguageFailure,
    LanguagesActions.deleteLanguageFailure,
    setFailure,
  ),

  on(LanguagesActions.clearError, (state) => ({ ...state, error: null })),
  on(LanguagesActions.clearSuccessMessage, (state) => ({ ...state, successMessage: null })),
);
