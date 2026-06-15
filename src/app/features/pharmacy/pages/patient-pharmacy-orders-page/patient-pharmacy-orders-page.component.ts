import { Component, inject, OnInit } from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { pharmacyOrderStatusClass, pharmacyOrderStatusLabel } from '../../../../core/models/pharmacy.model';

@Component({
  selector: 'app-patient-pharmacy-orders-page',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './patient-pharmacy-orders-page.component.html',
})
export class PatientPharmacyOrdersPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);
  readonly statusLabel = pharmacyOrderStatusLabel;
  readonly statusClass = pharmacyOrderStatusClass;

  ngOnInit(): void {
    this.pharmacyService.clearError();
    this.pharmacyService.loadMyOrders();
  }
}
