import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Primitive skeleton block.
 * Size/shape classes go on the host (e.g. class="h-10 w-32") so layout matches real UI.
 */
@Component({
  selector: 'app-skeleton-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'skeleton block',
    '[class.skeleton-circle]': 'circle()',
    '[attr.aria-hidden]': 'true',
  },
  template: '',
})
export class SkeletonBlockComponent {
  readonly circle = input(false);
}
