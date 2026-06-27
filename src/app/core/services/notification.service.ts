import { Injectable, signal } from '@angular/core';

export type NotificationVariant = 'error' | 'success';

export interface AppNotification {
  message: string;
  variant: NotificationVariant;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notification = signal<AppNotification | null>(null);
  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  readonly notification = this._notification.asReadonly();

  showError(message: string, durationMs = 6000): void {
    this.show(message, 'error', durationMs);
  }

  showSuccess(message: string, durationMs = 4000): void {
    this.show(message, 'success', durationMs);
  }

  clear(): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
      this.clearTimer = null;
    }
    this._notification.set(null);
  }

  private show(message: string, variant: NotificationVariant, durationMs: number): void {
    this.clear();
    this._notification.set({ message, variant });

    this.clearTimer = setTimeout(() => {
      this._notification.set(null);
      this.clearTimer = null;
    }, durationMs);
  }
}
