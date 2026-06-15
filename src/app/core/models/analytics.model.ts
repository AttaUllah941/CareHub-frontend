export type AnalyticsGranularity = 'daily' | 'monthly';

export interface AnalyticsQuery {
  fromDate?: string;
  toDate?: string;
  granularity?: AnalyticsGranularity;
}

export interface TrendPoint {
  period: string;
  count: number;
  cumulative: number;
  amount?: number;
}

export interface GrowthTrend {
  fromDate: string;
  toDate: string;
  granularity: AnalyticsGranularity;
  summary: Record<string, number | string>;
  series: TrendPoint[];
}

export interface RevenueTrend extends GrowthTrend {
  summary: {
    totalAmount: number;
    totalTransactions: number;
    currency: string;
  };
}

export interface AnalyticsOverview {
  revenue: RevenueTrend;
  doctors: GrowthTrend;
  patients: GrowthTrend;
  appointments: GrowthTrend;
}

export const DEFAULT_ANALYTICS_QUERY: AnalyticsQuery = {
  granularity: 'monthly',
};
