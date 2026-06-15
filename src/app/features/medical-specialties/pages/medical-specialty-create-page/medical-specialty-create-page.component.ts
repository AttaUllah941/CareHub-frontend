import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MedicalSpecialtyService } from '../../services/medical-specialty.service';
import { MedicalSpecialtyFormComponent } from '../../components/medical-specialty-form/medical-specialty-form.component';

@Component({
  selector: 'app-medical-specialty-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MedicalSpecialtyFormComponent],
  templateUrl: './medical-specialty-create-page.component.html',
  styleUrl: './medical-specialty-create-page.component.scss',
})
export class MedicalSpecialtyCreatePageComponent implements OnInit {
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z][a-z0-9-]*$/)]],
    description: [''],
  });

  ngOnInit(): void {
    this.specialtyService.clearError();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.specialtyService.createSpecialty(this.form.getRawValue());
  }
}
