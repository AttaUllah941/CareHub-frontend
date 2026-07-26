import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonBlockComponent } from './skeleton-block.component';

/** Single list row for appointments, orders, notifications. */
@Component({
  selector: 'app-list-row-skeleton',
  standalone: true,
  imports: [SkeletonBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
      aria-hidden="true"
      role="presentation"
    >
      @if (showAvatar()) {
        <app-skeleton-block class="h-10 w-10 shrink-0" [circle]="true" />
      }
      <div class="flex-1 min-w-0 space-y-2">
        <app-skeleton-block class="h-4 w-2/3 max-w-xs" />
        <app-skeleton-block class="h-3 w-1/2 max-w-sm" />
      </div>
      <app-skeleton-block class="h-8 w-16 rounded-lg shrink-0" />
    </div>
  `,
})
export class ListRowSkeletonComponent {
  readonly showAvatar = input(true);
}
