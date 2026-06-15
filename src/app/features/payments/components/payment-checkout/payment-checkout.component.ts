import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentGateway, PAYMENT_GATEWAY_OPTIONS } from '../../../../core/models/payment.model';

@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './payment-checkout.component.html',
  styleUrl: './payment-checkout.component.scss',
})
export class PaymentCheckoutComponent {
  readonly amount = input(0);
  readonly currency = input('PKR');
  readonly saving = input(false);

  readonly submit = output<PaymentGateway>();

  readonly gatewayOptions = PAYMENT_GATEWAY_OPTIONS;
  selectedGateway: PaymentGateway = 'JAZZCASH';

  onSubmit(): void {
    this.submit.emit(this.selectedGateway);
  }
}
