import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MedicalSpecialtyService } from '../../services/medical-specialty.service';
import { MedicalSpecialtyFormComponent } from '../../components/medical-specialty-form/medical-specialty-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-medical-specialty-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MedicalSpecialtyFormComponent, AlertComponent],
  templateUrl: './medical-specialty-edit-page.component.html',
  styleUrl: './medical-specialty-edit-page.component.scss',
})
export class MedicalSpecialtyEditPageComponent implements OnInit {
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  specialtyId = '';

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    isActive: [true],
  });

  constructor() {
    effect(() => {
      const specialty = this.specialtyService.selectedSpecialty();
      if (specialty && specialty.id === this.specialtyId) {
        this.form.patchValue({
          name: specialty.name,
          description: specialty.description ?? '',
          isActive: specialty.isActive,
        });
      }
    });
  }

  ngOnInit(): void {
    this.specialtyService.clearError();
    this.route.paramMap.subscribe((p) => {
      this.specialtyId = p.get('id') ?? '';
      if (this.specialtyId) this.specialtyService.loadSpecialty(this.specialtyId);
    });
  }

  onUpdate(): void {
    if (this.form.invalid) return;
    this.specialtyService.updateSpecialty(this.specialtyId, this.form.getRawValue());
  }
}
