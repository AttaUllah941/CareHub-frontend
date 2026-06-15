import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AnyReport, ExportFormat, ReportQuery, ReportType } from '../../../core/models/report.model';

export const ReportsActions = createActionGroup({
  source: 'Reports',
  events: {
    'Set Active Type': props<{ reportType: ReportType }>(),
    'Set Query': props<{ query: Partial<ReportQuery> }>(),

    'Load Report': props<{ reportType?: ReportType; query?: Partial<ReportQuery> }>(),
    'Load Report Success': props<{ report: AnyReport }>(),
    'Load Report Failure': props<{ error: string }>(),

    'Export Report': props<{ reportType?: ReportType; format: ExportFormat; query?: Partial<ReportQuery> }>(),
    'Export Report Success': props<{ message: string }>(),
    'Export Report Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
    'Clear Success Message': emptyProps(),
    'Clear Report': emptyProps(),
  },
});
