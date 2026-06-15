import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaymentGateway } from '../../../../core/models/payment.model';

@Component({
  selector: 'app-payment-callback-page',
  standalone: true,
  imports: [RouterLink, PaymentDetailComponent, AlertComponent],
  templateUrl: './payment-callback-page.component.html',
  styleUrl: './payment-callback-page.component.scss',
})
export class PaymentCallbackPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly paymentService = inject(PaymentService);

  readonly gateway: PaymentGateway =
    this.route.snapshot.url.some((s) => s.path === 'easypaisa') ? 'EASYPAISA' : 'JAZZCASH';

  ngOnInit(): void {
    const params: Record<string, string> = {};
    this.route.snapshot.queryParamMap.keys.forEach((key) => {
      const val = this.route.snapshot.queryParamMap.get(key);
      if (val) params[key] = val;
    });
    this.paymentService.completeCallback(this.gateway, params);
  }
}
