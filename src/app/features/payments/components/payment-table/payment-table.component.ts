import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  Payment,
  formatAmount,
  formatPaymentDate,
  gatewayLabel,
  paymentStatusClass,
  paymentStatusLabel,
} from '../../../../core/models/payment.model';

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './payment-table.component.html',
  styleUrl: './payment-table.component.scss',
})
export class PaymentTableComponent {
  readonly payments = input<Payment[]>([]);
  readonly loading = input(false);
  readonly showAppointment = input(true);
  readonly showActions = input(true);
  readonly adminMode = input(false);

  readonly viewPayment = output<Payment>();
  readonly refundPayment = output<Payment>();

  readonly formatDate = formatPaymentDate;
  readonly formatAmt = formatAmount;
  readonly statusLabel = paymentStatusLabel;
  readonly statusClass = paymentStatusClass;
  readonly gateway = gatewayLabel;

  colspan(): number {
    let cols = 5;
    if (this.showAppointment()) cols++;
    if (this.showActions()) cols++;
    return cols;
  }
}
