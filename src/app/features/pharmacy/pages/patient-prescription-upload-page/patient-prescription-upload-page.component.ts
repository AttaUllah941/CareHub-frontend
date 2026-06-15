import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { prescriptionUploadStatusClass } from '../../../../core/models/pharmacy.model';

@Component({
  selector: 'app-patient-prescription-upload-page',
  standalone: true,
  imports: [FormsModule, AlertComponent, DatePipe],
  templateUrl: './patient-prescription-upload-page.component.html',
})
export class PatientPrescriptionUploadPageComponent implements OnInit {
  protected readonly pharmacyService = inject(PharmacyService);
  readonly title = signal('Prescription Upload');
  readonly statusClass = prescriptionUploadStatusClass;

  ngOnInit(): void {
    this.pharmacyService.clearError();
    this.pharmacyService.loadMyUploads();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.pharmacyService.uploadPrescription(file, this.title());
    input.value = '';
  }
}
