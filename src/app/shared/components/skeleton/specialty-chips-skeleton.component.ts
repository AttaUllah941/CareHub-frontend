import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Home specialty card grid placeholder (matches specialty chip cards). */
@Component({
  selector: 'app-specialty-chips-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto"
      aria-busy="true"
      aria-live="polite"
    >
      <span class="sr-only">Loading specialties…</span>
      @for (i of chips(); track i) {
        <div class="card text-left p-4 space-y-2">
          <app-skeleton-block class="h-8 w-8 rounded-lg" />
          <app-skeleton-block class="h-4 w-28 mt-2" />
          <app-skeleton-block class="h-3 w-full" />
          <app-skeleton-block class="h-3 w-4/5" />
        </div>
      }
    </div>
  `,
})
export class SpecialtyChipsSkeletonComponent {
  readonly count = input(12);

  readonly chips = computed(() =>
    Array.from({ length: Math.max(4, this.count()) }, (_, i) => i + 1),
  );
}
