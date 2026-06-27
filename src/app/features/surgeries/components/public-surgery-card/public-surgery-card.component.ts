import { Component, input, signal } from '@angular/core';
import { SurgeryHospitalView, SurgeryProcedure } from '../../../../core/models/surgery.model';
import { formatSurgeryPriceRange } from '../../../marketplace/utils/marketplace-display.util';
import { SurgeryBookingModalComponent } from '../../../appointments/components/surgery-booking-modal/surgery-booking-modal.component';

@Component({
  selector: 'app-public-surgery-card',
  standalone: true,
  imports: [SurgeryBookingModalComponent],
  templateUrl: './public-surgery-card.component.html',
  styleUrl: './public-surgery-card.component.scss',
})
export class PublicSurgeryCardComponent {
  readonly surgery = input.required<SurgeryProcedure>();
  readonly hospital = input.required<SurgeryHospitalView>();

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
