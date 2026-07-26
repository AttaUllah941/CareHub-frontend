import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Stat tiles for doctor (2×4) or admin (1×3) dashboards. */
@Component({
  selector: 'app-dashboard-stats-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div aria-busy="true" aria-live="polite">
      <span class="sr-only">Loading dashboard…</span>
      @if (variant() === 'doctor') {
        <div class="mb-8 space-y-3">
          <app-skeleton-block class="h-3 w-28" />
          <app-skeleton-block class="h-8 w-64 max-w-full" />
          <app-skeleton-block class="h-4 w-48" />
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm ring-1 ring-black/5 space-y-3">
              <app-skeleton-block class="h-10 w-10 rounded-xl" />
              <app-skeleton-block class="h-7 w-16" />
              <app-skeleton-block class="h-4 w-24" />
            </div>
          }
        </div>
        <div class="grid lg:grid-cols-2 gap-6">
          @for (i of [1, 2]; track i) {
            <div class="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
              <div class="flex justify-between">
                <app-skeleton-block class="h-5 w-40" />
                <app-skeleton-block class="h-4 w-16" />
              </div>
              @for (r of [1, 2, 3]; track r) {
                <div class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div class="space-y-2 flex-1">
                    <app-skeleton-block class="h-4 w-32" />
                    <app-skeleton-block class="h-3 w-40" />
                  </div>
                  <app-skeleton-block class="h-4 w-12" />
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <div class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm ring-1 ring-black/5 space-y-3">
              <app-skeleton-block class="h-4 w-28" />
              <app-skeleton-block class="h-9 w-20" />
              @if (i > 2) {
                <div class="space-y-2 pt-2">
                  @for (r of [1, 2, 3]; track r) {
                    <div class="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <app-skeleton-block class="h-4 w-20" />
                      <app-skeleton-block class="h-4 w-8" />
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardStatsSkeletonComponent {
  readonly variant = input<'doctor' | 'admin'>('doctor');
}
