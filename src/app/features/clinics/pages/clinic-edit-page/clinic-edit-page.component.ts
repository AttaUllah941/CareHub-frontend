import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClinicService } from '../../services/clinic.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { ClinicFormComponent } from '../../components/clinic-form/clinic-form.component';
import { DEFAULT_CLINIC_WORKING_HOURS, ClinicWorkingDay } from '../../../../core/models/clinic.model';

@Component({
  selector: 'app-clinic-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ClinicFormComponent],
  templateUrl: './clinic-edit-page.component.html',
  styleUrl: './clinic-edit-page.component.scss',
})
export class ClinicEditPageComponent implements OnInit {
  protected readonly clinicService = inject(ClinicService);
  protected readonly doctorService = inject(DoctorService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly workingHours = signal<ClinicWorkingDay[]>(structuredClone(DEFAULT_CLINIC_WORKING_HOURS));
  readonly selectedDoctorIds = signal<string[]>([]);
  private clinicId = '';

  protected get clinicIdForLink(): string {
    return this.clinicId;
  }

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
    isActive: [true],
  });

  constructor() {
    effect(() => {
      const clinic = this.clinicService.selectedClinic();
      if (!clinic || clinic.id !== this.clinicId) return;
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
        managerId: clinic.managerId ?? '',
        isActive: clinic.isActive,
      });
      this.workingHours.set(structuredClone(clinic.workingHours ?? DEFAULT_CLINIC_WORKING_HOURS));
      this.selectedDoctorIds.set([...(clinic.doctorProfileIds ?? [])]);
    });
  }

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('id') ?? '';
    this.clinicService.clearError();
    this.doctorService.loadDoctors({ page: 1, limit: 100, isActive: 'true' });
    this.clinicService.loadClinic(this.clinicId);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.clinicService.updateClinic(this.clinicId, {
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
      isActive: v.isActive,
      workingHours: this.workingHours(),
      doctorProfileIds: this.selectedDoctorIds(),
      location: {
        latitude: v.latitude ?? undefined,
        longitude: v.longitude ?? undefined,
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/clinics', this.clinicId]);
  }
}
