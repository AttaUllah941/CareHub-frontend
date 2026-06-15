import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClinicService } from '../../services/clinic.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { ClinicFormComponent } from '../../components/clinic-form/clinic-form.component';
import { DEFAULT_CLINIC_WORKING_HOURS, ClinicWorkingDay } from '../../../../core/models/clinic.model';

@Component({
  selector: 'app-clinic-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ClinicFormComponent],
  templateUrl: './clinic-create-page.component.html',
  styleUrl: './clinic-create-page.component.scss',
})
export class ClinicCreatePageComponent implements OnInit {
  protected readonly clinicService = inject(ClinicService);
  protected readonly doctorService = inject(DoctorService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly workingHours = signal<ClinicWorkingDay[]>(structuredClone(DEFAULT_CLINIC_WORKING_HOURS));
  readonly selectedDoctorIds = signal<string[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9-]*$/)]],
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
    managerId: [''],
  });

  ngOnInit(): void {
    this.clinicService.clearError();
    this.doctorService.loadDoctors({ page: 1, limit: 100, isActive: 'true' });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.clinicService.createClinic({
      name: v.name,
      slug: v.slug,
      description: v.description || undefined,
      phone: v.phone || undefined,
      email: v.email || undefined,
      address: v.address || undefined,
      city: v.city || undefined,
      state: v.state || undefined,
      country: v.country || undefined,
      postalCode: v.postalCode || undefined,
      managerId: v.managerId || undefined,
      workingHours: this.workingHours(),
      doctorProfileIds: this.selectedDoctorIds(),
      location: {
        latitude: v.latitude ?? undefined,
        longitude: v.longitude ?? undefined,
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/clinics']);
  }
}
