import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../services/lab.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { labBookingStatusClass, labBookingStatusLabel, LAB_BOOKING_STATUS_OPTIONS } from '../../../../core/models/lab.model';

@Component({
  selector: 'app-admin-lab-bookings-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Lab Bookings</h1>
      @if (labService.error()) { <app-alert [message]="labService.error()!" variant="error" /> }
      <select class="border rounded-lg px-3 py-2 text-sm" (change)="onFilter($event)">
        @for (s of statusOptions; track s.value) { <option [value]="s.value">{{ s.label }}</option> }
      </select>
      <div class="bg-white border rounded-xl overflow-x-auto">
        <table class="min-w-full divide-y">
          <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Booking #</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Patient</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Type</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Total</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Status</th>
            <th class="px-4 py-3 text-right text-xs uppercase text-gray-500">Actions</th>
          </tr></thead>
          <tbody class="divide-y">
            @for (b of labService.bookings(); track b.id) {
              <tr>
                <td class="px-4 py-3 text-sm font-mono">{{ b.bookingNumber }}</td>
                <td class="px-4 py-3 text-sm">{{ b.patient?.user?.firstName }} {{ b.patient?.user?.lastName }}</td>
                <td class="px-4 py-3 text-sm">{{ b.collectionType === 'HOME_COLLECTION' ? 'Home' : 'Lab visit' }}</td>
                <td class="px-4 py-3 text-sm">{{ b.currency }} {{ b.total }}</td>
                <td class="px-4 py-3 text-sm"><span class="px-2 py-0.5 rounded-full text-xs" [class]="statusClass(b.status)">{{ statusLabel(b.status) }}</span></td>
                <td class="px-4 py-3 text-sm text-right">
                  @if (b.status !== 'COMPLETED' && b.status !== 'CANCELLED') {
                    <button type="button" (click)="advance(b.id, b.status)" class="text-teal-600">Advance</button>
                  }
                </td>
              </tr>
            } @empty { <tr><td colspan="6" class="px-4 py-8 text-center text-sm text-gray-500">No bookings</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminLabBookingsPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  readonly statusOptions = LAB_BOOKING_STATUS_OPTIONS;
  readonly statusLabel = labBookingStatusLabel;
  readonly statusClass = labBookingStatusClass;
  ngOnInit(): void { this.labService.loadBookings(); }
  onFilter(e: Event): void {
    const v = (e.target as HTMLSelectElement).value;
    this.labService.loadBookings(v ? { status: v } : {});
  }
  advance(id: string, status: string): void {
    const next: Record<string, string> = { PENDING: 'CONFIRMED', CONFIRMED: 'SAMPLE_COLLECTED', SAMPLE_COLLECTED: 'PROCESSING', PROCESSING: 'COMPLETED' };
    const s = next[status];
    if (s) this.labService.updateBookingStatus(id, s);
  }
}
