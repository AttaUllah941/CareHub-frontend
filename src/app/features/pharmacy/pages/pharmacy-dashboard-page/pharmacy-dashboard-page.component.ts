import { Component, inject, OnInit } from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';

@Component({
  selector: 'app-pharmacy-dashboard-page',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl border p-6">
          <p class="text-sm text-gray-500">Medicines in catalog</p>
          <p class="text-3xl font-bold text-teal-600 mt-2">{{ pharmacyService.medicines().length }}</p>
        </div>
        <div class="bg-white rounded-xl border p-6">
          <p class="text-sm text-gray-500">Pending orders</p>
          <p class="text-3xl font-bold text-amber-600 mt-2">{{ pendingOrders() }}</p>
        </div>
        <div class="bg-white rounded-xl border p-6">
          <p class="text-sm text-gray-500">Uploads to review</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ pendingUploads() }}</p>
        </div>
      </div>
    </div>
  `,
})
export class PharmacyDashboardPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);

  ngOnInit(): void {
    this.pharmacyService.loadMedicines({ limit: 5 });
    this.pharmacyService.loadOrders({ status: 'PENDING', limit: 50 });
    this.pharmacyService.loadUploads({ status: 'PENDING', limit: 50 });
  }

  pendingOrders(): number {
    return this.pharmacyService.orders().filter((o) => o.status === 'PENDING').length;
  }

  pendingUploads(): number {
    return this.pharmacyService.uploads().filter((u) => u.status === 'PENDING').length;
  }
}
