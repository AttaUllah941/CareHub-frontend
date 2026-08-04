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
        <div class="mb-8 skeleton-stack">
          <app-skeleton-block class="h-3.5 w-28" />
          <app-skeleton-block class="h-8 w-56 sm:w-64 max-w-full" />
          <app-skeleton-block class="h-4 w-44 sm:w-48" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="skeleton-card p-4 sm:p-5 skeleton-stack">
              <app-skeleton-block class="h-10 w-10 rounded-xl" />
              <app-skeleton-block class="h-7 w-16" />
              <app-skeleton-block class="h-4 w-24" />
            </div>
          }
        </div>
        <div class="grid lg:grid-cols-2 gap-5 lg:gap-6">
          @for (i of [1, 2]; track i) {
            <div class="skeleton-card p-5 sm:p-6 skeleton-stack">
              <div class="flex items-center justify-between gap-3">
                <app-skeleton-block class="h-5 w-36 sm:w-40" />
                <app-skeleton-block class="h-4 w-16" />
              </div>
              @for (r of [1, 2, 3]; track r) {
                <div class="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3.5 sm:px-4 py-3">
                  <div class="skeleton-stack-sm flex-1 min-w-0">
                    <app-skeleton-block class="h-4 w-28 sm:w-32" />
                    <app-skeleton-block class="h-3.5 w-36 sm:w-40" />
                  </div>
                  <app-skeleton-block class="h-4 w-12 shrink-0" />
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <div class="skeleton-card p-5 skeleton-stack">
              <app-skeleton-block class="h-4 w-28" />
              <app-skeleton-block class="h-9 w-20" />
              @if (i > 2) {
                <div class="skeleton-stack-sm pt-1">
                  @for (r of [1, 2, 3]; track r) {
                    <div class="flex justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
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
