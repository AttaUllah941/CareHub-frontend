import { Component, input, signal } from '@angular/core';
import { formatSurgeryPriceRange, SurgeryHospital, SurgeryProcedure } from '../../data/dummy-surgery.data';
import { SurgeryBookingModalComponent } from '../surgery-booking-modal/surgery-booking-modal.component';

@Component({
  selector: 'app-public-surgery-card',
  standalone: true,
  imports: [SurgeryBookingModalComponent],
  templateUrl: './public-surgery-card.component.html',
  styleUrl: './public-surgery-card.component.scss',
})
export class PublicSurgeryCardComponent {
  readonly surgery = input.required<SurgeryProcedure>();
  readonly hospital = input.required<SurgeryHospital>();

  readonly bookingModalOpen = signal(false);

  openBookingModal(): void {
    this.bookingModalOpen.set(true);
  }

  closeBookingModal(): void {
    this.bookingModalOpen.set(false);
  }

  formatPrice(priceFrom: number, priceTo?: number): string {
    return formatSurgeryPriceRange(priceFrom, priceTo);
  }
}
