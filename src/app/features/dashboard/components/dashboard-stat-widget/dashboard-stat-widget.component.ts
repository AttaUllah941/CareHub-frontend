import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-stat-widget',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-stat-widget.component.html',
  styleUrl: './dashboard-stat-widget.component.scss',
})
export class DashboardStatWidgetComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly subtitle = input('');
  readonly icon = input('📊');
  readonly accent = input<'teal' | 'blue' | 'amber' | 'green' | 'purple' | 'red'>('teal');
  readonly link = input<string | null>(null);
  readonly trend = input<number | null>(null);

  accentClass(): string {
    const map = {
      teal: 'bg-teal-50 text-teal-700 border-teal-100',
      blue: 'bg-blue-50 text-blue-700 border-blue-100',
      amber: 'bg-amber-50 text-amber-700 border-amber-100',
      green: 'bg-green-50 text-green-700 border-green-100',
      purple: 'bg-purple-50 text-purple-700 border-purple-100',
      red: 'bg-red-50 text-red-700 border-red-100',
    };
    return map[this.accent()];
  }

  trendLabel(): string | null {
    const t = this.trend();
    if (t === null) return null;
    const abs = Math.abs(t);
    return `${t >= 0 ? '↑' : '↓'} ${abs}% vs last month`;
  }
}
