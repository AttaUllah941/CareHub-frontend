import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DoctorCardSkeletonComponent } from './doctor-card-skeleton.component';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Hero + optional doctor list placeholders for facility detail pages. */
@Component({
  selector: 'app-facility-detail-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent, DoctorCardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div aria-busy="true" aria-live="polite">
      <span class="sr-only">Loading details…</span>
      <div class="bg-white border-b border-gray-200">
        <div class="page-container py-6 sm:py-8">
          <app-skeleton-block class="h-4 w-48 sm:w-64 mb-5" />
          <div class="flex flex-col lg:flex-row gap-5 lg:gap-8">
            <app-skeleton-block class="w-full lg:w-72 h-48 lg:h-56 rounded-2xl shrink-0" />
            <div class="flex-1 min-w-0 skeleton-stack">
              <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <app-skeleton-block class="h-8 w-56 sm:w-64 max-w-full" />
                <app-skeleton-block class="h-6 w-20 rounded-full" />
              </div>
              <app-skeleton-block class="h-4 w-44" />
              <app-skeleton-block class="h-4 w-full" />
              <app-skeleton-block class="h-4 w-5/6" />
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (i of contactSlots; track i) {
                  <div class="skeleton-stack-sm rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                    <app-skeleton-block class="h-3.5 w-20" />
                    <app-skeleton-block class="h-4 w-36" />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      @if (showDoctorList()) {
        <div class="page-container py-8">
          <app-skeleton-block class="h-6 w-48 sm:w-56 mb-2" />
          <app-skeleton-block class="h-4 w-64 sm:w-80 mb-6" />
          <div class="space-y-5">
            @for (i of doctorSlots(); track i) {
              <app-doctor-card-skeleton />
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class FacilityDetailSkeletonComponent {
  readonly showDoctorList = input(true);
  readonly doctorCount = input(2);

  readonly contactSlots = [1, 2, 3, 4];
  readonly doctorSlots = computed(() =>
    Array.from({ length: Math.max(1, this.doctorCount()) }, (_, i) => i + 1),
  );
}
