import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-admin-inventory-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './admin-inventory-page.component.html',
})
export class AdminInventoryPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);
  readonly medicineId = signal('');
  readonly quantity = signal(0);
  readonly reorderLevel = signal(10);

  ngOnInit(): void {
    this.pharmacyService.loadInventory();
    this.pharmacyService.loadMedicines({ limit: 100 });
  }

  save(): void {
    if (!this.medicineId()) return;
    this.pharmacyService.upsertInventory({
      medicineId: this.medicineId(),
      quantity: this.quantity(),
      reorderLevel: this.reorderLevel(),
    });
  }
}
