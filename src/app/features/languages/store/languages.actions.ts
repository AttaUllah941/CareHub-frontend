import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateLanguageRequest,
  Language,
  LanguageListQuery,
  PaginationMeta,
  UpdateLanguageRequest,
} from '../../../core/models/language.model';

export const LanguagesActions = createActionGroup({
  source: 'Languages',
  events: {
    'Load Languages': props<{ query?: Partial<LanguageListQuery> }>(),
    'Load Languages Success': props<{
      languages: Language[];
      pagination: PaginationMeta;
      query: LanguageListQuery;
    }>(),
    'Load Languages Failure': props<{ error: string }>(),

    'Load All Languages': emptyProps(),
    'Load All Languages Success': props<{ languages: Language[] }>(),
    'Load All Languages Failure': props<{ error: string }>(),

    'Load Language': props<{ id: string }>(),
    'Load Language Success': props<{ language: Language }>(),
    'Load Language Failure': props<{ error: string }>(),

    'Create Language': props<{ payload: CreateLanguageRequest }>(),
    'Create Language Success': props<{ language: Language; message: string }>(),
    'Create Language Failure': props<{ error: string }>(),

    'Update Language': props<{ id: string; payload: UpdateLanguageRequest }>(),
    'Update Language Success': props<{ language: Language; message: string }>(),
    'Update Language Failure': props<{ error: string }>(),

    'Delete Language': props<{ id: string }>(),
    'Delete Language Success': props<{ message: string }>(),
    'Delete Language Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
  },
});
