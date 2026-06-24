import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  readonly showForm = signal(false);
  readonly patientId = signal('');
  readonly diagnosis = signal('');
  readonly medName = signal('');
  readonly medDosage = signal('');
  readonly medDuration = signal('');
  readonly medicines = signal<{ name: string; dosage: string; duration: string }[]>([]);
  readonly notes = signal('');
  readonly created = signal(false);

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
    this.portal.createPrescription(this.patientId(), this.diagnosis(), this.medicines(), this.notes());
    this.showForm.set(false);
    this.patientId.set('');
    this.diagnosis.set('');
    this.medicines.set([]);
    this.notes.set('');
    this.created.set(true);
    setTimeout(() => this.created.set(false), 3000);
  }
}
