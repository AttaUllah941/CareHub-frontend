import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatLabPrice, LabTest } from '../../data/dummy-labs.data';

@Component({
  selector: 'app-public-lab-test-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-lab-test-card.component.html',
  styleUrl: './public-lab-test-card.component.scss',
})
export class PublicLabTestCardComponent {
  readonly test = input.required<LabTest>();

  formatPrice(price: number): string {
    return formatLabPrice(price);
  }
}
