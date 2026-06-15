import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { PaymentService } from '../../services/payment.service';
import { PaymentTableComponent } from '../../components/payment-table/payment-table.component';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { PaymentCheckoutComponent } from '../../components/payment-checkout/payment-checkout.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Appointment } from '../../../../core/models/appointment.model';
import { Payment, PaymentGateway } from '../../../../core/models/payment.model';

@Component({
  selector: 'app-payment-list-page',
  standalone: true,
  imports: [
    DatePipe,
    PaymentTableComponent,
    PaymentDetailComponent,
    PaymentCheckoutComponent,
    AlertComponent,
    PaginationComponent,
  ],
  templateUrl: './payment-list-page.component.html',
  styleUrl: './payment-list-page.component.scss',
})
export class PaymentListPageComponent implements OnInit {
  protected readonly paymentService = inject(PaymentService);
  protected readonly appointmentService = inject(AppointmentService);

  readonly selected = signal<Payment | null>(null);
  readonly payingAppointment = signal<Appointment | null>(null);

  constructor() {
    effect(() => {
      if (this.paymentService.successMessage() && !this.paymentService.initiatedPayment()) {
        this.payingAppointment.set(null);
        this.paymentService.loadMyPayments();
        this.appointmentService.loadMyAppointments();
      }
    });
  }

  ngOnInit(): void {
    this.paymentService.clearError();
    this.paymentService.clearSuccessMessage();
    this.paymentService.loadMyPayments();
    this.appointmentService.loadMyAppointments();
  }

  unpaidAppointments(): Appointment[] {
    return this.appointmentService
      .myAppointments()
      .filter(
        (a) =>
          (a.status === 'PENDING' || a.status === 'CONFIRMED') &&
          (a.consultationFee ?? 0) > 0 &&
          (!a.paymentStatus || a.paymentStatus === 'UNPAID' || a.paymentStatus === 'FAILED'),
      );
  }

  startPayment(appointment: Appointment): void {
    this.payingAppointment.set(appointment);
    this.selected.set(null);
  }

  onPay(gateway: PaymentGateway): void {
    const appt = this.payingAppointment();
    if (!appt) return;
    this.paymentService.initiatePayment(appt.id, { gateway });
  }

  onView(p: Payment): void {
    this.selected.set(p);
    this.payingAppointment.set(null);
  }

  onPageChange(page: number): void {
    this.paymentService.loadMyPayments({ page });
  }

  closeDetail(): void {
    this.selected.set(null);
    this.payingAppointment.set(null);
  }
}
