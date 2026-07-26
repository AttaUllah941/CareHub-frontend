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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <app-skeleton-block class="h-4 w-64 mb-4" />
          <div class="flex flex-col lg:flex-row gap-6">
            <app-skeleton-block class="lg:w-72 h-48 lg:h-56 w-full rounded-2xl shrink-0" />
            <div class="flex-1 space-y-3">
              <div class="flex flex-wrap items-center gap-3">
                <app-skeleton-block class="h-8 w-64 max-w-full" />
                <app-skeleton-block class="h-6 w-20 rounded-full" />
              </div>
              <app-skeleton-block class="h-4 w-48" />
              <app-skeleton-block class="h-4 w-full" />
              <app-skeleton-block class="h-4 w-5/6" />
              <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (i of contactSlots; track i) {
                  <div class="space-y-2">
                    <app-skeleton-block class="h-4 w-20" />
                    <app-skeleton-block class="h-4 w-40" />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      @if (showDoctorList()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <app-skeleton-block class="h-6 w-56 mb-2" />
          <app-skeleton-block class="h-4 w-80 mb-6" />
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
