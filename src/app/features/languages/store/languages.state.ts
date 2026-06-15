import {
  DEFAULT_LANGUAGE_LIST_QUERY,
  Language,
  LanguageListQuery,
} from '../../../core/models/language.model';

export interface LanguagesState {
  languages: Language[];
  allLanguages: Language[];
  selectedLanguage: Language | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  query: LanguageListQuery;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

export const LANGUAGES_FEATURE_KEY = 'languages';

export const initialLanguagesState: LanguagesState = {
  languages: [],
  allLanguages: [],
  selectedLanguage: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  query: { ...DEFAULT_LANGUAGE_LIST_QUERY },
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};
