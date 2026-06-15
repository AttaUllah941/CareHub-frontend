import { Component, input, output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { MedicalSpecialty } from '../../../../core/models/medical-specialty.model';
import { Language } from '../../../../core/models/language.model';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, AlertComponent],
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.scss',
})
export class DoctorFormComponent {
  readonly form = input.required<FormGroup>();
  readonly loading = input(false);
  readonly error = input('');
  readonly mode = input<'create' | 'edit' | 'profile'>('create');
  readonly specialties = input<MedicalSpecialty[]>([]);
  readonly languages = input<Language[]>([]);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();

  get qualifications(): FormArray {
    return this.form().get('qualifications') as FormArray;
  }

  get workHistory(): FormArray {
    return this.form().get('workHistory') as FormArray;
  }

  isSpecialtySelected(id: string): boolean {
    const ids: string[] = this.form().get('specialtyIds')?.value ?? [];
    return ids.includes(id);
  }

  isLanguageSelected(id: string): boolean {
    const ids: string[] = this.form().get('languageIds')?.value ?? [];
    return ids.includes(id);
  }

  toggleSpecialty(id: string): void {
    const control = this.form().get('specialtyIds');
    const current: string[] = [...(control?.value ?? [])];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    control?.setValue(updated);
  }

  toggleLanguage(id: string): void {
    const control = this.form().get('languageIds');
    const current: string[] = [...(control?.value ?? [])];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    control?.setValue(updated);
  }

  removeQualification(index: number): void {
    this.qualifications.removeAt(index);
  }

  removeWorkHistory(index: number): void {
    this.workHistory.removeAt(index);
  }
}
