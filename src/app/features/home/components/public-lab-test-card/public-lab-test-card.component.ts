import { Component, input, signal } from '@angular/core';
import { formatLabPrice, LabTest, PublicLab } from '../../data/dummy-labs.data';
import { LabTestBookingModalComponent } from '../lab-test-booking-modal/lab-test-booking-modal.component';

@Component({
  selector: 'app-public-lab-test-card',
  standalone: true,
  imports: [LabTestBookingModalComponent],
  templateUrl: './public-lab-test-card.component.html',
  styleUrl: './public-lab-test-card.component.scss',
})
export class PublicLabTestCardComponent {
  readonly test = input.required<LabTest>();
  readonly lab = input.required<PublicLab>();

  readonly bookingModalOpen = signal(false);

  openBookingModal(): void {
    this.bookingModalOpen.set(true);
  }

  closeBookingModal(): void {
    this.bookingModalOpen.set(false);
  }

  formatPrice(price: number): string {
    return formatLabPrice(price);
  }
}
