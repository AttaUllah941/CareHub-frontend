import { AnyReport, ReportQuery, ReportType } from '../../../core/models/report.model';

export interface ReportsState {
  activeType: ReportType;
  query: ReportQuery;
  report: AnyReport | null;
  loading: boolean;
  exporting: boolean;
  error: string | null;
  successMessage: string | null;
}

export const REPORTS_FEATURE_KEY = 'reports';

export const initialReportsState: ReportsState = {
  activeType: 'REVENUE',
  query: { fromDate: '', toDate: '', status: '', verificationStatus: '' },
  report: null,
  loading: false,
  exporting: false,
  error: null,
  successMessage: null,
};
