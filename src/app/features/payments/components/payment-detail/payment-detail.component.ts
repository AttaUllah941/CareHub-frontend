import { Component, input } from '@angular/core';
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
  selector: 'app-payment-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.scss',
})
export class PaymentDetailComponent {
  readonly payment = input.required<Payment>();

  readonly formatDate = formatPaymentDate;
  readonly formatAmt = formatAmount;
  readonly statusLabel = paymentStatusLabel;
  readonly statusClass = paymentStatusClass;
  readonly gateway = gatewayLabel;
}
