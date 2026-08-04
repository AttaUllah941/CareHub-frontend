import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';
import { ListRowSkeletonComponent } from './list-row-skeleton.component';

/** Doctor profile header + reviews column + booking sidebar. */
@Component({
  selector: 'app-doctor-profile-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent, ListRowSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gray-50 min-h-full" aria-busy="true" aria-live="polite">
      <span class="sr-only">Loading doctor profile…</span>

      <div class="bg-white border-b border-gray-200">
        <div class="page-container py-3">
          <app-skeleton-block class="h-4 w-56 sm:w-72" />
        </div>
      </div>

      <div class="bg-white border-b border-gray-200">
        <div class="page-container py-6">
          <div class="skeleton-card p-5 sm:p-6">
            <div class="flex flex-col lg:flex-row gap-5 lg:gap-6">
              <app-skeleton-block
                class="h-28 w-28 sm:h-32 sm:w-32 shrink-0 border-4 border-gray-100"
                [circle]="true"
              />
              <div class="flex-1 min-w-0 skeleton-stack">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                  <app-skeleton-block class="h-7 w-48 sm:w-56 max-w-full" />
                  <app-skeleton-block class="h-6 w-28 rounded-full" />
                  <app-skeleton-block class="h-8 w-28 rounded-xl" />
                </div>
                <app-skeleton-block class="h-4 w-44" />
                <app-skeleton-block class="h-4 w-56" />
                <div class="flex flex-wrap gap-4 sm:gap-6 pt-1">
                  <app-skeleton-block class="h-5 w-24" />
                  <app-skeleton-block class="h-5 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-container py-8">
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div class="flex-1 min-w-0">
            <div class="skeleton-card overflow-hidden">
              <div class="p-5 sm:p-6 border-b border-gray-100 skeleton-stack">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div class="skeleton-stack-sm">
                    <app-skeleton-block class="h-5 w-40" />
                    <app-skeleton-block class="h-4 w-28" />
                  </div>
                  <app-skeleton-block class="h-8 w-48 sm:w-56 rounded-xl" />
                </div>
                <div class="flex flex-wrap gap-4 sm:gap-6">
                  <app-skeleton-block class="h-4 w-32" />
                  <app-skeleton-block class="h-4 w-40" />
                </div>
                <div class="skeleton-stack pt-1">
                  @for (i of [1, 2, 3, 4]; track i) {
                    <div class="skeleton-stack-sm">
                      <div class="flex justify-between gap-3">
                        <app-skeleton-block class="h-3 w-28 sm:w-32" />
                        <app-skeleton-block class="h-3 w-10" />
                      </div>
                      <app-skeleton-block class="h-2 w-full rounded-full" />
                    </div>
                  }
                </div>
              </div>
              <div class="divide-y divide-gray-100 p-4 sm:p-5 space-y-3">
                @for (i of [1, 2, 3]; track i) {
                  <app-list-row-skeleton [showAvatar]="true" />
                }
              </div>
            </div>
          </div>

          <div class="w-full lg:w-80 shrink-0 space-y-4">
            <div class="skeleton-card p-5 skeleton-stack">
              <app-skeleton-block class="h-5 w-40" />
              <app-skeleton-block class="h-10 w-full rounded-xl" />
              <app-skeleton-block class="h-24 w-full rounded-xl" />
              <app-skeleton-block class="h-10 w-full rounded-xl" />
              <app-skeleton-block class="h-11 w-full rounded-xl" />
            </div>
            <div class="skeleton-card p-5 skeleton-stack">
              <app-skeleton-block class="h-5 w-32" />
              <app-skeleton-block class="h-10 w-full rounded-xl" />
              <app-skeleton-block class="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DoctorProfileSkeletonComponent {}
