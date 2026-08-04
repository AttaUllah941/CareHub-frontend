import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Bordered table shell with matching column/row placeholders. */
@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-card" aria-busy="true" aria-live="polite">
      <span class="sr-only">Loading table…</span>
      <div class="border-b border-gray-100 bg-gray-50/80 px-4 sm:px-5 py-3.5 flex gap-3 sm:gap-4">
        @for (c of columns(); track c) {
          <app-skeleton-block class="h-4 flex-1 rounded-md" />
        }
      </div>
      @for (r of rows(); track r) {
        <div
          class="border-b border-gray-50 px-4 sm:px-5 py-4 flex gap-3 sm:gap-4 items-center last:border-0"
        >
          @for (c of columns(); track c) {
            <app-skeleton-block class="h-4 flex-1 rounded-md" />
          }
        </div>
      }
    </div>
  `,
})
export class TableSkeletonComponent {
  readonly columnCount = input(4);
  readonly rowCount = input(6);

  readonly columns = computed(() =>
    Array.from({ length: Math.max(2, this.columnCount()) }, (_, i) => i + 1),
  );
  readonly rows = computed(() =>
    Array.from({ length: Math.max(1, this.rowCount()) }, (_, i) => i + 1),
  );
}
