import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Matches `app-public-doctor-listing-card` layout (avatar, info, CTAs, slot tiles). */
@Component({
  selector: 'app-doctor-card-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <div class="p-5 sm:p-6">
        <div class="flex flex-col lg:flex-row gap-5">
          <app-skeleton-block class="h-20 w-20 sm:h-24 sm:w-24 shrink-0" [circle]="true" />
          <div class="flex-1 min-w-0 space-y-2.5">
            <app-skeleton-block class="h-5 w-2/3 max-w-xs" />
            <app-skeleton-block class="h-4 w-28" />
            <app-skeleton-block class="h-4 w-1/2 max-w-sm" />
            <app-skeleton-block class="h-4 w-3/4 max-w-md" />
            <div class="flex flex-wrap gap-3 pt-1">
              <app-skeleton-block class="h-4 w-24" />
              <app-skeleton-block class="h-4 w-28" />
              <app-skeleton-block class="h-4 w-32" />
            </div>
          </div>
          <div class="flex flex-row lg:flex-col gap-2 shrink-0 lg:w-48">
            <app-skeleton-block class="h-10 flex-1 lg:w-full rounded-lg" />
            <app-skeleton-block class="h-10 flex-1 lg:w-full rounded-lg" />
          </div>
        </div>
      </div>
      <div class="border-t border-gray-100 bg-gray-50/60 px-5 sm:px-6 py-4">
        <div class="flex gap-3 overflow-hidden">
          <app-skeleton-block class="h-24 w-56 sm:w-60 shrink-0 rounded-lg" />
          <app-skeleton-block class="h-24 w-64 sm:w-72 shrink-0 rounded-lg" />
        </div>
      </div>
    </article>
  `,
})
export class DoctorCardSkeletonComponent {}
