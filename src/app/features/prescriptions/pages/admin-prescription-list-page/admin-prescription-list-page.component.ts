import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionTableComponent } from '../../components/prescription-table/prescription-table.component';
import { PrescriptionDetailComponent } from '../../components/prescription-detail/prescription-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Prescription } from '../../../../core/models/prescription.model';

@Component({
  selector: 'app-admin-prescription-list-page',
  standalone: true,
  imports: [
    FormsModule,
    PrescriptionTableComponent,
    PrescriptionDetailComponent,
    AlertComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-prescription-list-page.component.html',
  styleUrl: './admin-prescription-list-page.component.scss',
})
export class AdminPrescriptionListPageComponent implements OnInit {
  protected readonly prescriptionService = inject(PrescriptionService);
  readonly search = signal('');
  readonly viewing = signal<Prescription | null>(null);

  ngOnInit(): void {
    this.prescriptionService.clearError();
    this.prescriptionService.clearSuccessMessage();
    this.prescriptionService.loadPrescriptions();
  }

  onSearch(): void {
    this.prescriptionService.loadPrescriptions({ search: this.search(), page: 1 });
  }

  onPageChange(page: number): void {
    this.prescriptionService.loadPrescriptions({ page });
  }

  onView(p: Prescription): void {
    this.viewing.set(p);
  }

  onDownload(p: Prescription): void {
    this.prescriptionService.downloadPdf(p.id);
  }

  onDelete(p: Prescription): void {
    if (confirm('Remove this prescription?')) {
      this.prescriptionService.deletePrescription(p.id);
    }
  }
}
