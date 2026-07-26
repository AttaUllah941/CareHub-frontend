import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Matches hospital/lab/pharmacy/surgery city grid cards. */
@Component({
  selector: 'app-facility-card-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
      aria-hidden="true"
      role="presentation"
    >
      <app-skeleton-block class="block h-44 w-full rounded-none" />
      <div class="p-5 space-y-3">
        <div class="flex items-start justify-between gap-3">
          <app-skeleton-block class="h-5 w-2/3" />
          <app-skeleton-block class="h-5 w-12 rounded-full" />
        </div>
        <app-skeleton-block class="h-4 w-full" />
        <app-skeleton-block class="h-3 w-4/5" />
        <div class="flex items-center gap-3 pt-1">
          <app-skeleton-block class="h-4 w-16" />
          <app-skeleton-block class="h-4 w-24" />
        </div>
        <div class="flex flex-wrap gap-1.5 pt-1">
          <app-skeleton-block class="h-5 w-16 rounded-full" />
          <app-skeleton-block class="h-5 w-20 rounded-full" />
          <app-skeleton-block class="h-5 w-14 rounded-full" />
        </div>
        <app-skeleton-block class="h-4 w-40 mt-1" />
      </div>
    </div>
  `,
})
export class FacilityCardSkeletonComponent {}
