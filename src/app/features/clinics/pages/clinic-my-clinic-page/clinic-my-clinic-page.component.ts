import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicService } from '../../services/clinic.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { ClinicFormComponent } from '../../components/clinic-form/clinic-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { DEFAULT_CLINIC_WORKING_HOURS, ClinicWorkingDay } from '../../../../core/models/clinic.model';

@Component({
  selector: 'app-clinic-my-clinic-page',
  standalone: true,
  imports: [ReactiveFormsModule, ClinicFormComponent, AlertComponent],
  templateUrl: './clinic-my-clinic-page.component.html',
  styleUrl: './clinic-my-clinic-page.component.scss',
})
export class ClinicMyClinicPageComponent implements OnInit {
  protected readonly clinicService = inject(ClinicService);
  protected readonly doctorService = inject(DoctorService);
  private readonly fb = inject(FormBuilder);

  readonly workingHours = signal<ClinicWorkingDay[]>(structuredClone(DEFAULT_CLINIC_WORKING_HOURS));
  readonly selectedDoctorIds = signal<string[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: [{ value: '', disabled: true }],
    description: [''],
    phone: [''],
    email: ['', Validators.email],
    address: [''],
    city: [''],
    state: [''],
    country: [''],
    postalCode: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
  });

  constructor() {
    effect(() => {
      const clinic = this.clinicService.myClinic();
      if (!clinic) return;
      this.form.patchValue({
        name: clinic.name,
        slug: clinic.slug,
        description: clinic.description ?? '',
        phone: clinic.phone ?? '',
        email: clinic.email ?? '',
        address: clinic.address ?? '',
        city: clinic.city ?? '',
        state: clinic.state ?? '',
        country: clinic.country ?? '',
        postalCode: clinic.postalCode ?? '',
        latitude: clinic.location?.latitude ?? null,
        longitude: clinic.location?.longitude ?? null,
      });
      this.workingHours.set(structuredClone(clinic.workingHours ?? DEFAULT_CLINIC_WORKING_HOURS));
      this.selectedDoctorIds.set([...(clinic.doctorProfileIds ?? [])]);
    });
  }

  ngOnInit(): void {
    this.clinicService.clearError();
    this.doctorService.loadDoctors({ page: 1, limit: 100, isActive: 'true' });
    this.clinicService.loadMyClinic();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.clinicService.updateMyClinic({
      name: v.name,
      description: v.description || undefined,
      phone: v.phone || undefined,
      email: v.email || undefined,
      address: v.address || undefined,
      city: v.city || undefined,
      state: v.state || undefined,
      country: v.country || undefined,
      postalCode: v.postalCode || undefined,
      workingHours: this.workingHours(),
      doctorProfileIds: this.selectedDoctorIds(),
      location: {
        latitude: v.latitude ?? undefined,
        longitude: v.longitude ?? undefined,
      },
    });
  }
}
