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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <app-skeleton-block class="h-4 w-72" />
        </div>
      </div>

      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div class="flex flex-col lg:flex-row gap-6">
              <app-skeleton-block class="h-28 w-28 sm:h-32 sm:w-32 shrink-0 border-4 border-gray-100" [circle]="true" />
              <div class="flex-1 min-w-0 space-y-3">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                  <app-skeleton-block class="h-7 w-56 max-w-full" />
                  <app-skeleton-block class="h-6 w-32 rounded-full" />
                  <app-skeleton-block class="h-8 w-28 rounded-lg" />
                </div>
                <app-skeleton-block class="h-4 w-48" />
                <app-skeleton-block class="h-4 w-64" />
                <div class="flex flex-wrap gap-6 pt-2">
                  <app-skeleton-block class="h-5 w-24" />
                  <app-skeleton-block class="h-5 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-1 min-w-0">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-5 sm:p-6 border-b border-gray-100 space-y-4">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div class="space-y-2">
                    <app-skeleton-block class="h-5 w-40" />
                    <app-skeleton-block class="h-4 w-28" />
                  </div>
                  <app-skeleton-block class="h-8 w-56 rounded-lg" />
                </div>
                <div class="flex flex-wrap gap-6">
                  <app-skeleton-block class="h-4 w-32" />
                  <app-skeleton-block class="h-4 w-40" />
                </div>
                <div class="space-y-3 pt-2">
                  @for (i of [1, 2, 3, 4]; track i) {
                    <div class="space-y-1.5">
                      <div class="flex justify-between">
                        <app-skeleton-block class="h-3 w-32" />
                        <app-skeleton-block class="h-3 w-10" />
                      </div>
                      <app-skeleton-block class="h-2 w-full rounded-full" />
                    </div>
                  }
                </div>
              </div>
              <div class="divide-y divide-gray-100 p-4 space-y-3">
                @for (i of [1, 2, 3]; track i) {
                  <app-list-row-skeleton [showAvatar]="true" />
                }
              </div>
            </div>
          </div>

          <div class="w-full lg:w-80 shrink-0 space-y-4">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
              <app-skeleton-block class="h-5 w-40" />
              <app-skeleton-block class="h-10 w-full rounded-lg" />
              <app-skeleton-block class="h-24 w-full rounded-lg" />
              <app-skeleton-block class="h-10 w-full rounded-lg" />
              <app-skeleton-block class="h-11 w-full rounded-lg" />
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
              <app-skeleton-block class="h-5 w-32" />
              <app-skeleton-block class="h-10 w-full rounded-lg" />
              <app-skeleton-block class="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DoctorProfileSkeletonComponent {}
