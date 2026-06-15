import { Component, inject, OnInit, signal } from '@angular/core';
import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionTableComponent } from '../../components/prescription-table/prescription-table.component';
import { PrescriptionDetailComponent } from '../../components/prescription-detail/prescription-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Prescription } from '../../../../core/models/prescription.model';

@Component({
  selector: 'app-prescription-list-page',
  standalone: true,
  imports: [PrescriptionTableComponent, PrescriptionDetailComponent, AlertComponent],
  templateUrl: './prescription-list-page.component.html',
  styleUrl: './prescription-list-page.component.scss',
})
export class PrescriptionListPageComponent implements OnInit {
  protected readonly prescriptionService = inject(PrescriptionService);
  readonly selected = signal<Prescription | null>(null);

  ngOnInit(): void {
    this.prescriptionService.clearError();
    this.prescriptionService.clearSuccessMessage();
    this.prescriptionService.loadMyPrescriptions();
  }

  onView(p: Prescription): void {
    this.selected.set(p);
  }

  onDownload(p: Prescription): void {
    this.prescriptionService.downloadPdf(p.id);
  }

  closeDetail(): void {
    this.selected.set(null);
  }
}
