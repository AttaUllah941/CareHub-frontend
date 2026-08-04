import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
} from '@angular/core';
import {
  FACILITY_FALLBACK_IMAGES,
  FacilityImageKind,
  optimizeFacilityImageUrl,
} from '../../../core/utils/facility-image.util';

@Component({
  selector: 'app-facility-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full w-full',
  },
  template: `
    <div class="relative h-full w-full overflow-hidden bg-gray-100">
      @if (!loaded()) {
        <div class="absolute inset-0 facility-image-shimmer" aria-hidden="true"></div>
      }
      <img
        [src]="displaySrc()"
        [alt]="alt()"
        [attr.loading]="priority() === 'high' ? 'eager' : 'lazy'"
        decoding="async"
        [attr.fetchpriority]="priority() === 'high' ? 'high' : null"
        class="h-full w-full object-cover transition-[opacity,transform] duration-300"
        [class.opacity-0]="!loaded()"
        [class.opacity-100]="loaded()"
        [class.group-hover:scale-105]="hoverZoom()"
        (load)="onLoad()"
        (error)="onError()"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }

    .facility-image-shimmer {
      background: linear-gradient(110deg, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%);
      background-size: 200% 100%;
      animation: facility-image-shimmer 1.2s linear infinite;
    }

    @keyframes facility-image-shimmer {
      to {
        background-position-x: -200%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .facility-image-shimmer {
        animation: none;
      }
    }
  `,
})
export class FacilityImageComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly kind = input<FacilityImageKind>('hospital');
  readonly variant = input<'card' | 'detail'>('card');
  readonly priority = input<'high' | 'low'>('low');
  readonly hoverZoom = input(false);

  private readonly failed = signal(false);
  readonly loaded = signal(false);

  readonly displaySrc = computed(() => {
    const fallback = FACILITY_FALLBACK_IMAGES[this.kind()];
    if (this.failed()) {
      return fallback;
    }

    const width = this.variant() === 'card' ? 640 : 960;
    const optimized = optimizeFacilityImageUrl(this.src(), width);
    return optimized || fallback;
  });

  constructor() {
    // Reset load/error state when the bound source or facility kind changes.
    // Writes stay untracked so this effect does not re-enter on its own updates.
    effect(() => {
      this.src();
      this.kind();
      untracked(() => {
        this.failed.set(false);
        this.loaded.set(false);
      });
    });
  }

  onLoad(): void {
    this.loaded.set(true);
  }

  onError(): void {
    if (this.failed()) {
      // Local SVG fallback also failed; stop shimmering and show empty shell.
      this.loaded.set(true);
      return;
    }
    this.failed.set(true);
    this.loaded.set(false);
  }
}
