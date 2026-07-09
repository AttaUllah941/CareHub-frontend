import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-shell',
  standalone: true,
  imports: [],
  template: `
  @if (notificationService.notification(); as toast) {
    <div
      class="fixed bottom-4 right-4 z-[100] max-w-sm w-[calc(100%-2rem)] sm:w-96 animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div
        class="flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm"
        [class]="toast.variant === 'error'
          ? 'bg-red-50/95 text-red-800 border-red-200'
          : 'bg-emerald-50/95 text-emerald-800 border-emerald-200'"
      >
        
        <p class="flex-1 text-sm font-medium leading-relaxed">{{ toast.message }}</p>
        <button
          type="button"
          (click)="notificationService.clear()"
          class="shrink-0 rounded-md p-1 text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss notification"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  }

  @if (loadingService.isLoading()) {
    <div
      class="fixed top-0 left-0 right-0 z-[90] h-1 bg-brand-100 overflow-hidden"
      aria-hidden="true"
    >
      <div class="h-full w-1/3 bg-brand-600 animate-pulse"></div>
    </div>
  }
  `,
  styles: `
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-toast-in {
      animation: toast-in 0.25s ease-out;
    }
  `,
})
export class GlobalShellComponent {
  protected readonly notificationService = inject(NotificationService);
  protected readonly loadingService = inject(LoadingService);
}
