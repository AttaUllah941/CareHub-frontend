import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClinicService } from '../../../clinics/services/clinic.service';
import { FamilyMemberService } from '../../../family-members/services/family-member.service';
import { DoctorSearchResult } from '../../../../core/models/doctor.model';
import { Clinic } from '../../../../core/models/clinic.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-appointment-book-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, AlertComponent, InputComponent, DatePipe],
  templateUrl: './appointment-book-page.component.html',
  styleUrl: './appointment-book-page.component.scss',
})
export class AppointmentBookPageComponent implements OnInit {
  protected readonly appointmentService = inject(AppointmentService);
  protected readonly clinicService = inject(ClinicService);
  protected readonly familyMemberService = inject(FamilyMemberService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly doctor = signal<DoctorSearchResult | null>(null);
  readonly doctorClinics = signal<Clinic[]>([]);
  readonly selectedDate = signal('');
  readonly selectedClinicId = signal('');
  readonly selectedSlot = signal('');
  readonly familyMemberId = signal('');
  readonly reason = signal('');

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('doctorId') ?? '';
    const stateDoctor = history.state?.doctor as DoctorSearchResult | undefined;
    if (stateDoctor?.id === doctorId) {
      this.doctor.set(stateDoctor);
    } else {
      this.doctor.set({ id: doctorId, userId: '', specialtyIds: [], languageIds: [] } as DoctorSearchResult);
    }

    this.appointmentService.clearError();
    this.appointmentService.clearSuccessMessage();
    this.clinicService.loadAllClinics();
    this.familyMemberService.loadMyFamilyMembers();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate.set(tomorrow.toISOString().slice(0, 10));
  }

  clinicsForDoctor(): Clinic[] {
    const doctorId = this.doctor()?.id;
    if (!doctorId) return [];
    return this.clinicService.allClinics().filter((c) => c.doctorProfileIds?.includes(doctorId));
  }

  onClinicChange(clinicId: string): void {
    this.selectedClinicId.set(clinicId);
    this.selectedSlot.set('');
    this.loadWeekOverview();
    this.loadSlots();
  }

  onDateChange(date: string): void {
    this.selectedDate.set(date);
    this.selectedSlot.set('');
    this.loadSlots();
  }

  loadWeekOverview(): void {
    const doctorId = this.doctor()?.id;
    const clinicId = this.selectedClinicId();
    if (!doctorId || !clinicId) return;

    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 6);

    this.appointmentService.loadRecurringSlots(
      doctorId,
      from.toISOString(),
      to.toISOString(),
      { clinicId, maxDays: 7 },
    );
  }

  loadSlots(): void {
    const doctorId = this.doctor()?.id;
    const date = this.selectedDate();
    const clinicId = this.selectedClinicId();
    if (!doctorId || !date || !clinicId) return;
    this.appointmentService.loadAvailableSlots(doctorId, new Date(date).toISOString(), clinicId);
  }

  selectDayFromWeek(dateKey: string): void {
    this.selectedDate.set(dateKey.slice(0, 10));
    this.selectedSlot.set('');
    this.loadSlots();
  }

  onBook(): void {
    const doctorId = this.doctor()?.id;
    if (!doctorId || !this.selectedClinicId() || !this.selectedDate() || !this.selectedSlot()) return;

    this.appointmentService.bookAppointment({
      doctorProfileId: doctorId,
      clinicId: this.selectedClinicId(),
      appointmentDate: new Date(this.selectedDate()).toISOString(),
      startTime: this.selectedSlot(),
      familyMemberId: this.familyMemberId() || undefined,
      reason: this.reason() || undefined,
    });
  }
}
