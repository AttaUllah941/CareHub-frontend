import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Matches `app-public-doctor-listing-card` layout (avatar, info, CTAs, slot tiles). */
@Component({
  selector: 'app-doctor-card-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="skeleton-card w-full max-w-4xl mx-auto" aria-hidden="true" role="presentation">
      <div class="p-4 sm:p-5 lg:p-6">
        <div class="flex flex-col md:flex-row gap-4 md:gap-5">
          <app-skeleton-block class="h-20 w-20 sm:h-24 sm:w-24 shrink-0" [circle]="true" />
          <div class="flex-1 min-w-0 skeleton-stack">
            <app-skeleton-block class="h-5 w-2/3 max-w-xs" />
            <app-skeleton-block class="h-4 w-28" />
            <app-skeleton-block class="h-4 w-1/2 max-w-sm" />
            <app-skeleton-block class="h-4 w-3/4 max-w-md" />
            <div class="flex flex-wrap gap-2.5 pt-1">
              <app-skeleton-block class="h-4 w-24 rounded-full" />
              <app-skeleton-block class="h-4 w-28 rounded-full" />
              <app-skeleton-block class="h-4 w-32 rounded-full" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 md:w-44 lg:w-48">
            <app-skeleton-block class="h-10 w-full rounded-xl" />
            <app-skeleton-block class="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
      <div class="border-t border-gray-100 bg-gray-50/70 px-4 sm:px-5 lg:px-6 py-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <app-skeleton-block class="h-[7.5rem] w-full rounded-xl" />
          <app-skeleton-block class="h-[7.5rem] w-full rounded-xl" />
        </div>
      </div>
    </article>
  `,
})
export class DoctorCardSkeletonComponent {}
