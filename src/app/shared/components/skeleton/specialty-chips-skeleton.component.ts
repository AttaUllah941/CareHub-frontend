import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Home specialty card grid placeholder (matches specialty chip cards). */
@Component({
  selector: 'app-specialty-chips-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mirrors the real specialty card in home-page: same grid, gap, padding and line heights. -->
    <div
      class="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-6xl mx-auto"
      aria-busy="true"
      aria-live="polite"
    >
      <span class="sr-only">Loading specialties…</span>
      @for (i of chips(); track i) {
        <div class="skeleton-card p-3 sm:p-4 min-w-0" aria-hidden="true">
          <!-- icon: text-xl / sm:text-2xl line box -->
          <div class="flex h-7 items-center sm:h-8">
            <app-skeleton-block class="h-6 w-6 sm:h-7 sm:w-7 rounded-lg" />
          </div>
          <!-- name: mt-2, text-sm leading-snug (1 line) -->
          <div class="mt-2 flex h-[1.09rem] items-center">
            <app-skeleton-block class="h-3.5 w-3/4 max-w-[8rem]" />
          </div>
          <!-- description: mt-0.5, text-xs leading-relaxed (2 lines) -->
          <div class="mt-0.5 flex h-[2.44rem] flex-col justify-center gap-1.5">
            <app-skeleton-block class="h-2.5 w-full" />
            <app-skeleton-block class="h-2.5 w-4/5" />
          </div>
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
