import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { AnalyticsGranularity } from '../../../../core/models/analytics.model';

@Component({
  selector: 'app-admin-analytics-page',
  standalone: true,
  imports: [FormsModule, DecimalPipe, AlertComponent, LineChartComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">Analytics</h1>
          <p class="text-sm text-gray-500">Revenue trends and platform growth metrics</p>
        </div>
        <div class="flex flex-wrap gap-3 items-end">
          <div>
            <label class="block text-xs text-gray-500 mb-1">From</label>
            <input type="date" class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="fromDate" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">To</label>
            <input type="date" class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="toDate" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Granularity</label>
            <select class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="granularity">
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <button type="button" (click)="applyFilters()" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">
            Apply
          </button>
        </div>
      </div>

      @if (analytics.error()) {
        <app-alert [message]="analytics.error()!" variant="error" />
      }

      @if (analytics.loading()) {
        <p class="text-gray-500 text-sm">Loading analytics...</p>
      } @else if (analytics.overview()) {
        <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="bg-white border rounded-xl p-4">
            <p class="text-xs text-gray-500 uppercase">Total Revenue</p>
            <p class="text-2xl font-bold text-teal-600 mt-1">
              {{ revenueCurrency() }} {{ revenueTotal() | number }}
            </p>
            <p class="text-xs text-gray-400 mt-1">{{ revenueTransactions() }} transactions</p>
          </div>
          <div class="bg-white border rounded-xl p-4">
            <p class="text-xs text-gray-500 uppercase">Doctors</p>
            <p class="text-2xl font-bold mt-1">{{ doctorTotal() }}</p>
            <p class="text-xs text-gray-400 mt-1">+{{ doctorNewInRange() }} in range</p>
          </div>
          <div class="bg-white border rounded-xl p-4">
            <p class="text-xs text-gray-500 uppercase">Patients</p>
            <p class="text-2xl font-bold mt-1">{{ patientTotal() }}</p>
            <p class="text-xs text-gray-400 mt-1">+{{ patientNewInRange() }} in range</p>
          </div>
          <div class="bg-white border rounded-xl p-4">
            <p class="text-xs text-gray-500 uppercase">Appointments</p>
            <p class="text-2xl font-bold mt-1">{{ appointmentTotal() }}</p>
            <p class="text-xs text-gray-400 mt-1">+{{ appointmentNewInRange() }} in range</p>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">
          <div class="bg-white border rounded-xl p-5">
            <h2 class="font-semibold mb-1">Revenue Trends</h2>
            <p class="text-xs text-gray-500 mb-4">Payment revenue over time</p>
            <app-line-chart
              [labels]="periods(analytics.revenue())"
              [data]="amounts(analytics.revenue())"
              label="Revenue"
              color="#0d9488"
              type="line"
              [currency]="revenueCurrency()"
            />
          </div>

          <div class="bg-white border rounded-xl p-5">
            <h2 class="font-semibold mb-1">Doctor Growth</h2>
            <p class="text-xs text-gray-500 mb-4">New doctor registrations per period</p>
            <app-line-chart
              [labels]="periods(analytics.doctors())"
              [data]="counts(analytics.doctors())"
              label="New Doctors"
              color="#2563eb"
              type="bar"
            />
          </div>

          <div class="bg-white border rounded-xl p-5">
            <h2 class="font-semibold mb-1">Patient Growth</h2>
            <p class="text-xs text-gray-500 mb-4">New patient registrations per period</p>
            <app-line-chart
              [labels]="periods(analytics.patients())"
              [data]="counts(analytics.patients())"
              label="New Patients"
              color="#7c3aed"
              type="bar"
            />
          </div>

          <div class="bg-white border rounded-xl p-5">
            <h2 class="font-semibold mb-1">Appointment Growth</h2>
            <p class="text-xs text-gray-500 mb-4">New appointments booked per period</p>
            <app-line-chart
              [labels]="periods(analytics.appointments())"
              [data]="counts(analytics.appointments())"
              label="New Appointments"
              color="#ea580c"
              type="line"
            />
          </div>
        </div>

        <div class="bg-white border rounded-xl p-5">
          <h2 class="font-semibold mb-4">Cumulative Growth</h2>
          <div class="grid lg:grid-cols-3 gap-6">
            <div>
              <p class="text-xs text-gray-500 mb-2">Doctors (cumulative)</p>
              <app-line-chart
                [labels]="periods(analytics.doctors())"
                [data]="cumulative(analytics.doctors())"
                label="Cumulative Doctors"
                color="#2563eb"
              />
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Patients (cumulative)</p>
              <app-line-chart
                [labels]="periods(analytics.patients())"
                [data]="cumulative(analytics.patients())"
                label="Cumulative Patients"
                color="#7c3aed"
              />
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Appointments (cumulative)</p>
              <app-line-chart
                [labels]="periods(analytics.appointments())"
                [data]="cumulative(analytics.appointments())"
                label="Cumulative Appointments"
                color="#ea580c"
              />
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminAnalyticsPageComponent implements OnInit {
  protected readonly analytics = inject(AnalyticsService);

  fromDate = '';
  toDate = '';
  granularity: AnalyticsGranularity = 'monthly';

  ngOnInit(): void {
    const now = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 11);
    from.setDate(1);
    this.fromDate = from.toISOString().slice(0, 10);
    this.toDate = now.toISOString().slice(0, 10);
    this.applyFilters();
  }

  applyFilters(): void {
    this.analytics.loadOverview({
      fromDate: this.fromDate,
      toDate: this.toDate,
      granularity: this.granularity,
    });
  }

  periods(trend: { series: { period: string }[] } | null): string[] {
    return trend?.series.map((p) => p.period) ?? [];
  }

  counts(trend: { series: { count: number }[] } | null): number[] {
    return trend?.series.map((p) => p.count) ?? [];
  }

  amounts(trend: { series: { amount?: number }[] } | null): number[] {
    return trend?.series.map((p) => p.amount ?? 0) ?? [];
  }

  cumulative(trend: { series: { cumulative: number }[] } | null): number[] {
    return trend?.series.map((p) => p.cumulative) ?? [];
  }

  revenueCurrency(): string {
    return this.analytics.revenue()?.summary?.currency ?? 'PKR';
  }

  revenueTotal(): number {
    return this.analytics.revenue()?.summary?.totalAmount ?? 0;
  }

  revenueTransactions(): number {
    return this.analytics.revenue()?.summary?.totalTransactions ?? 0;
  }

  doctorTotal(): number {
    return Number(this.analytics.doctors()?.summary?.['total'] ?? 0);
  }

  doctorNewInRange(): number {
    return Number(this.analytics.doctors()?.summary?.['newInRange'] ?? 0);
  }

  patientTotal(): number {
    return Number(this.analytics.patients()?.summary?.['total'] ?? 0);
  }

  patientNewInRange(): number {
    return Number(this.analytics.patients()?.summary?.['newInRange'] ?? 0);
  }

  appointmentTotal(): number {
    return Number(this.analytics.appointments()?.summary?.['total'] ?? 0);
  }

  appointmentNewInRange(): number {
    return Number(this.analytics.appointments()?.summary?.['newInRange'] ?? 0);
  }
}
