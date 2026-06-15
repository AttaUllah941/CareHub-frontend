import { Component, inject, OnInit } from '@angular/core';
import { LabService } from '../../services/lab.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { labBookingStatusClass, labBookingStatusLabel } from '../../../../core/models/lab.model';

@Component({
  selector: 'app-patient-lab-bookings-page',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">My Lab Bookings</h1>
      @if (labService.error()) { <app-alert [message]="labService.error()!" variant="error" /> }
      <div class="bg-white border rounded-xl overflow-x-auto">
        <table class="min-w-full divide-y">
          <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Booking #</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Lab</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Type</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Total</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Status</th>
          </tr></thead>
          <tbody class="divide-y">
            @for (b of labService.myBookings(); track b.id) {
              <tr>
                <td class="px-4 py-3 text-sm font-mono">{{ b.bookingNumber }}</td>
                <td class="px-4 py-3 text-sm">{{ b.lab?.name }}</td>
                <td class="px-4 py-3 text-sm">{{ b.collectionType === 'HOME_COLLECTION' ? 'Home collection' : 'Lab visit' }}</td>
                <td class="px-4 py-3 text-sm">{{ b.currency }} {{ b.total }}</td>
                <td class="px-4 py-3 text-sm"><span class="px-2 py-0.5 rounded-full text-xs" [class]="statusClass(b.status)">{{ statusLabel(b.status) }}</span></td>
              </tr>
            } @empty { <tr><td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500">No bookings</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class PatientLabBookingsPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  readonly statusLabel = labBookingStatusLabel;
  readonly statusClass = labBookingStatusClass;
  ngOnInit(): void { this.labService.loadMyBookings(); }
}
