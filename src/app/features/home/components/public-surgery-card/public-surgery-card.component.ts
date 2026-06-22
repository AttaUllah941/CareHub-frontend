import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatSurgeryPriceRange, SurgeryProcedure } from '../../data/dummy-surgery.data';

@Component({
  selector: 'app-public-surgery-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-surgery-card.component.html',
  styleUrl: './public-surgery-card.component.scss',
})
export class PublicSurgeryCardComponent {
  readonly surgery = input.required<SurgeryProcedure>();

  formatPrice(priceFrom: number, priceTo?: number): string {
    return formatSurgeryPriceRange(priceFrom, priceTo);
  }
}
