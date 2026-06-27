import { Component, inject } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-shell',
  standalone: true,
  imports: [AlertComponent],
  template: `
  @if (notificationService.notification(); as toast) {
    <div class="fixed top-4 right-4 z-[100] max-w-md w-[calc(100%-2rem)]">
      <app-alert [message]="toast.message" [variant]="toast.variant" />
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
})
export class GlobalShellComponent {
  protected readonly notificationService = inject(NotificationService);
  protected readonly loadingService = inject(LoadingService);
}
