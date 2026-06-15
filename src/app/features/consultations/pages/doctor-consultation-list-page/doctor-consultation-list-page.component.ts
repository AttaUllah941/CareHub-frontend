import { DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConsultationService } from '../../services/consultation.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { ConsultationTableComponent } from '../../components/consultation-table/consultation-table.component';
import { ConsultationFormComponent } from '../../components/consultation-form/consultation-form.component';
import { ConsultationDetailComponent } from '../../components/consultation-detail/consultation-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Consultation } from '../../../../core/models/consultation.model';
import { Appointment } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-doctor-consultation-list-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    ConsultationTableComponent,
    ConsultationFormComponent,
    ConsultationDetailComponent,
    AlertComponent,
    ButtonComponent,
  ],
  templateUrl: './doctor-consultation-list-page.component.html',
  styleUrl: './doctor-consultation-list-page.component.scss',
})
export class DoctorConsultationListPageComponent implements OnInit {
  protected readonly consultationService = inject(ConsultationService);
  protected readonly appointmentService = inject(AppointmentService);
  private readonly fb = inject(FormBuilder);

  readonly showForm = signal(false);
  readonly editingConsultation = signal<Consultation | null>(null);
  readonly selectedAppointment = signal<Appointment | null>(null);
  readonly viewing = signal<Consultation | null>(null);

  form = this.fb.nonNullable.group({
    diagnosis: [''],
    observations: [''],
    doctorNotes: [''],
    recommendations: [''],
  });

  constructor() {
    effect(() => {
      if (this.consultationService.successMessage()) {
        this.showForm.set(false);
        this.editingConsultation.set(null);
        this.selectedAppointment.set(null);
        this.resetForm();
        this.consultationService.loadDoctorConsultations();
        this.appointmentService.loadDoctorAppointments();
      }
    });
  }

  ngOnInit(): void {
    this.consultationService.clearError();
    this.consultationService.clearSuccessMessage();
    this.consultationService.loadDoctorConsultations();
    this.appointmentService.loadDoctorAppointments();
  }

  appointmentsWithoutConsultation(): Appointment[] {
    const recorded = new Set(this.consultationService.doctorConsultations().map((c) => c.appointmentId));
    return this.appointmentService.doctorAppointments().filter(
      (a) => !recorded.has(a.id) && ['CONFIRMED', 'COMPLETED'].includes(a.status),
    );
  }

  startRecord(appointment: Appointment): void {
    this.editingConsultation.set(null);
    this.selectedAppointment.set(appointment);
    this.viewing.set(null);
    this.resetForm();
    this.showForm.set(true);
  }

  startEdit(consultation: Consultation): void {
    this.editingConsultation.set(consultation);
    this.selectedAppointment.set(consultation.appointment ?? null);
    this.viewing.set(null);
    this.form.patchValue({
      diagnosis: consultation.diagnosis ?? '',
      observations: consultation.observations ?? '',
      doctorNotes: consultation.doctorNotes ?? '',
      recommendations: consultation.recommendations ?? '',
    });
    this.showForm.set(true);
  }

  onView(consultation: Consultation): void {
    this.viewing.set(consultation);
    this.showForm.set(false);
  }

  onSubmit(): void {
    const editing = this.editingConsultation();
    const payload = this.form.getRawValue();

    if (editing) {
      this.consultationService.updateConsultation(editing.id, payload);
      return;
    }

    const appointment = this.selectedAppointment();
    if (!appointment) return;
    this.consultationService.createConsultation(appointment.id, payload);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingConsultation.set(null);
    this.selectedAppointment.set(null);
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({ diagnosis: '', observations: '', doctorNotes: '', recommendations: '' });
  }
}
