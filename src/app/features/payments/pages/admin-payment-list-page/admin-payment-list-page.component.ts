import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { PaymentTableComponent } from '../../components/payment-table/payment-table.component';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { PaymentRefundFormComponent } from '../../components/payment-refund-form/payment-refund-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import {
  Payment,
  PAYMENT_GATEWAY_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '../../../../core/models/payment.model';

@Component({
  selector: 'app-admin-payment-list-page',
  standalone: true,
  imports: [
    FormsModule,
    PaymentTableComponent,
    PaymentDetailComponent,
    PaymentRefundFormComponent,
    AlertComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-payment-list-page.component.html',
  styleUrl: './admin-payment-list-page.component.scss',
})
export class AdminPaymentListPageComponent implements OnInit {
  protected readonly paymentService = inject(PaymentService);

  readonly search = signal('');
  readonly statusFilter = signal('');
  readonly gatewayFilter = signal('');
  readonly viewing = signal<Payment | null>(null);
  readonly refunding = signal<Payment | null>(null);
  readonly statusOptions = PAYMENT_STATUS_OPTIONS;
  readonly gatewayOptions = PAYMENT_GATEWAY_OPTIONS;

  constructor() {
    effect(() => {
      if (this.paymentService.successMessage()) {
        this.refunding.set(null);
        this.paymentService.loadPayments();
      }
    });
  }

  ngOnInit(): void {
    this.paymentService.clearError();
    this.paymentService.clearSuccessMessage();
    this.paymentService.loadPayments();
  }

  onSearch(): void {
    this.paymentService.loadPayments({
      search: this.search(),
      status: this.statusFilter(),
      gateway: this.gatewayFilter(),
      page: 1,
    });
  }

  onPageChange(page: number): void {
    this.paymentService.loadPayments({ page });
  }

  onView(p: Payment): void {
    this.viewing.set(p);
    this.refunding.set(null);
  }

  onRefund(p: Payment): void {
    this.refunding.set(p);
    this.viewing.set(null);
  }

  onSubmitRefund(payload: { amount?: number; reason: string }): void {
    const p = this.refunding();
    if (!p) return;
    this.paymentService.initiateRefund(p.id, payload);
  }

  closeDetail(): void {
    this.viewing.set(null);
    this.refunding.set(null);
  }
}
