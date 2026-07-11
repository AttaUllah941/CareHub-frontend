import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LabBooking, LabBookingStatus } from '../../../../core/models/lab.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatLabPrice } from '../../../marketplace/utils/marketplace-display.util';
import { LabsApiService } from '../../services/labs-api.service';
import {
  labBookingStatusBadge,
  labBookingStatusLabel,
} from '../../../appointments/utils/booking-status.util';

import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-my-lab-tests-page',
  standalone: true,
  imports: [RouterLink, DatePipe, IconComponent],
  templateUrl: './my-lab-tests-page.component.html',
  styleUrl: './my-lab-tests-page.component.scss',
})
export class MyLabTestsPageComponent implements OnInit {
  private readonly labsApi = inject(LabsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly bookings = signal<LabBooking[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal<'all' | LabBookingStatus>('all');
  readonly actionId = signal<string | null>(null);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadBookings();
    }
  }

  loadBookings(): void {
    this.loading.set(true);
    this.error.set(null);

    const filter = this.filter();
    const status = filter === 'all' ? undefined : filter;

    this.labsApi.listMine({ page: 1, limit: 50, status }).subscribe({
      next: (res) => {
        this.bookings.set(res.data.bookings);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  setFilter(value: string): void {
    this.filter.set(value as 'all' | LabBookingStatus);
    this.loadBookings();
  }

  cancelBooking(id: string): void {
    this.actionId.set(id);

    this.labsApi.cancel(id).subscribe({
      next: () => {
        this.notifications.showSuccess('Lab test booking cancelled.');
        this.actionId.set(null);
        this.loadBookings();
      },
      error: (err) => {
        this.notifications.showError(this.apiErrorService.getMessage(err));
        this.actionId.set(null);
      },
    });
  }

  formatPrice(price: number, currency = 'PKR'): string {
    return formatLabPrice(price, currency);
  }

  formatSchedule(booking: LabBooking): string {
    const date = new Date(`${booking.scheduledDate}T00:00:00`);
    const formatted = date.toLocaleDateString('en-PK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return `${formatted} · ${booking.scheduledSlot}`;
  }

  collectionLabel(type: LabBooking['collectionType']): string {
    return type === 'home' ? 'Home sample collection' : 'Lab visit';
  }

  canCancel(status: LabBookingStatus): boolean {
    return status === 'pending' || status === 'confirmed';
  }

  statusBadge(status: LabBookingStatus): string {
    return labBookingStatusBadge(status);
  }

  statusLabel(status: LabBookingStatus | string): string {
    return labBookingStatusLabel(status);
  }
}
