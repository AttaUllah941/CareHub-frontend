import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-prescriptions-page',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './doctor-prescriptions-page.component.html',
  styleUrl: './doctor-prescriptions-page.component.scss',
})
export class DoctorPrescriptionsPageComponent {
  readonly portal = inject(DoctorPortalService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly showForm = signal(false);
  readonly patientId = signal('');
  readonly diagnosis = signal('');
  readonly medName = signal('');
  readonly medDosage = signal('');
  readonly medDuration = signal('');
  readonly medicines = signal<{ name: string; dosage: string; duration: string }[]>([]);
  readonly notes = signal('');
  readonly created = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  addMedicine(): void {
    if (!this.medName().trim()) return;
    this.medicines.update((list) => [
      ...list,
      { name: this.medName(), dosage: this.medDosage(), duration: this.medDuration() },
    ]);
    this.medName.set('');
    this.medDosage.set('');
    this.medDuration.set('');
  }

  submitPrescription(): void {
    if (!this.patientId() || !this.diagnosis().trim() || this.medicines().length === 0) return;

    this.submitting.set(true);
    this.submitError.set(null);

    this.portal
      .createPrescription(this.patientId(), this.diagnosis(), this.medicines(), this.notes())
      .subscribe({
        next: () => {
          this.showForm.set(false);
          this.patientId.set('');
          this.diagnosis.set('');
          this.medicines.set([]);
          this.notes.set('');
          this.created.set(true);
          this.submitting.set(false);
          setTimeout(() => this.created.set(false), 3000);
        },
        error: (err) => {
          this.submitError.set(this.apiErrorService.getMessage(err));
          this.submitting.set(false);
        },
      });
  }
}
