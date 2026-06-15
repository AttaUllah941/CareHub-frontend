import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { CreateMedicineRequest } from '../../../../core/models/pharmacy.model';

@Component({
  selector: 'app-admin-medicine-list-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './admin-medicine-list-page.component.html',
})
export class AdminMedicineListPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);
  readonly search = signal('');
  readonly showForm = signal(false);
  readonly form = signal<CreateMedicineRequest>({
    name: '',
    genericName: '',
    strength: '',
    form: 'TABLET',
    sellingPrice: 0,
    requiresPrescription: true,
  });

  ngOnInit(): void {
    this.pharmacyService.clearError();
    this.pharmacyService.loadMedicines();
  }

  onSearch(): void {
    this.pharmacyService.loadMedicines({ search: this.search(), page: 1 });
  }

  submit(): void {
    this.pharmacyService.createMedicine(this.form());
    this.showForm.set(false);
  }
}
