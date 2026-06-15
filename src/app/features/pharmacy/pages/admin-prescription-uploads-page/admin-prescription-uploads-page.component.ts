import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { prescriptionUploadStatusClass } from '../../../../core/models/pharmacy.model';

@Component({
  selector: 'app-admin-prescription-uploads-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './admin-prescription-uploads-page.component.html',
})
export class AdminPrescriptionUploadsPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);
  readonly statusClass = prescriptionUploadStatusClass;

  ngOnInit(): void {
    this.pharmacyService.loadUploads({ status: 'PENDING' });
  }

  approve(id: string): void {
    this.pharmacyService.reviewUpload(id, 'APPROVED');
  }

  reject(id: string): void {
    const notes = prompt('Rejection reason (optional):') ?? '';
    this.pharmacyService.reviewUpload(id, 'REJECTED', notes || undefined);
  }
}
