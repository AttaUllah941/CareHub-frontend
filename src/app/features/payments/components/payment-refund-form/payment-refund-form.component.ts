import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface RefundFormPayload {
  amount?: number;
  reason: string;
}

@Component({
  selector: 'app-payment-refund-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment-refund-form.component.html',
  styleUrl: './payment-refund-form.component.scss',
})
export class PaymentRefundFormComponent {
  readonly maxAmount = input(0);
  readonly currency = input('PKR');
  readonly saving = input(false);

  readonly submit = output<RefundFormPayload>();

  amount: number | null = null;
  reason = '';

  onSubmit(): void {
    if (!this.reason.trim()) return;
    this.submit.emit({
      amount: this.amount ?? undefined,
      reason: this.reason.trim(),
    });
  }
}
