import { DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultationService } from '../../../consultations/services/consultation.service';
import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionTableComponent } from '../../components/prescription-table/prescription-table.component';
import { PrescriptionFormComponent } from '../../components/prescription-form/prescription-form.component';
import { PrescriptionDetailComponent } from '../../components/prescription-detail/prescription-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Consultation } from '../../../../core/models/consultation.model';
import { Prescription } from '../../../../core/models/prescription.model';

@Component({
  selector: 'app-doctor-prescription-list-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    PrescriptionTableComponent,
    PrescriptionFormComponent,
    PrescriptionDetailComponent,
    AlertComponent,
    ButtonComponent,
  ],
  templateUrl: './doctor-prescription-list-page.component.html',
  styleUrl: './doctor-prescription-list-page.component.scss',
})
export class DoctorPrescriptionListPageComponent implements OnInit {
  protected readonly prescriptionService = inject(PrescriptionService);
  protected readonly consultationService = inject(ConsultationService);
  private readonly fb = inject(FormBuilder);

  readonly showForm = signal(false);
  readonly editingPrescription = signal<Prescription | null>(null);
  readonly selectedConsultation = signal<Consultation | null>(null);
  readonly viewing = signal<Prescription | null>(null);

  form = this.fb.nonNullable.group({
    medicines: this.fb.array([this.createMedicineGroup()]),
    notes: [''],
  });

  constructor() {
    effect(() => {
      if (this.prescriptionService.successMessage()) {
        this.showForm.set(false);
        this.editingPrescription.set(null);
        this.selectedConsultation.set(null);
        this.resetForm();
        this.prescriptionService.loadDoctorPrescriptions();
        this.consultationService.loadDoctorConsultations();
      }
    });
  }

  ngOnInit(): void {
    this.prescriptionService.clearError();
    this.prescriptionService.clearSuccessMessage();
    this.prescriptionService.loadDoctorPrescriptions();
    this.consultationService.loadDoctorConsultations();
  }

  createMedicineGroup() {
    return this.fb.nonNullable.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      duration: ['', Validators.required],
      instructions: [''],
    });
  }

  medicinesArray(): FormArray {
    return this.form.get('medicines') as FormArray;
  }

  consultationsWithoutPrescription(): Consultation[] {
    const prescribed = new Set(this.prescriptionService.doctorPrescriptions().map((p) => p.consultationId));
    return this.consultationService.doctorConsultations().filter((c) => !prescribed.has(c.id));
  }

  startCreate(consultation: Consultation): void {
    this.editingPrescription.set(null);
    this.selectedConsultation.set(consultation);
    this.viewing.set(null);
    this.resetForm();
    this.showForm.set(true);
  }

  startEdit(prescription: Prescription): void {
    this.editingPrescription.set(prescription);
    this.selectedConsultation.set(prescription.consultation ?? null);
    this.viewing.set(null);
    this.medicinesArray().clear();
    prescription.medicines.forEach((m) => {
      this.medicinesArray().push(
        this.fb.nonNullable.group({
          name: [m.name, Validators.required],
          dosage: [m.dosage, Validators.required],
          duration: [m.duration, Validators.required],
          instructions: [m.instructions ?? ''],
        }),
      );
    });
    this.form.patchValue({ notes: prescription.notes ?? '' });
    this.showForm.set(true);
  }

  onView(p: Prescription): void {
    this.viewing.set(p);
    this.showForm.set(false);
  }

  addMedicine(): void {
    this.medicinesArray().push(this.createMedicineGroup());
  }

  removeMedicine(index: number): void {
    if (this.medicinesArray().length > 1) this.medicinesArray().removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    const editing = this.editingPrescription();

    if (editing) {
      this.prescriptionService.updatePrescription(editing.id, payload);
      return;
    }

    const consultation = this.selectedConsultation();
    if (!consultation) return;
    this.prescriptionService.createPrescription(consultation.id, payload);
  }

  onDownload(p: Prescription): void {
    this.prescriptionService.downloadPdf(p.id);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingPrescription.set(null);
    this.selectedConsultation.set(null);
    this.resetForm();
  }

  private resetForm(): void {
    this.medicinesArray().clear();
    this.medicinesArray().push(this.createMedicineGroup());
    this.form.patchValue({ notes: '' });
  }
}
