import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Doctor } from '../../../../core/models/doctor.model';
import { ClinicWorkingDay } from '../../../../core/models/clinic.model';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ClinicWorkingHoursComponent } from '../clinic-working-hours/clinic-working-hours.component';
import { ClinicMapPreviewComponent } from '../clinic-map-preview/clinic-map-preview.component';
import { ClinicDoctorPickerComponent } from '../clinic-doctor-picker/clinic-doctor-picker.component';

@Component({
  selector: 'app-clinic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    AlertComponent,
    ClinicWorkingHoursComponent,
    ClinicMapPreviewComponent,
    ClinicDoctorPickerComponent,
  ],
  templateUrl: './clinic-form.component.html',
  styleUrl: './clinic-form.component.scss',
})
export class ClinicFormComponent {
  readonly form = input.required<FormGroup>();
  readonly workingHours = input.required<ClinicWorkingDay[]>();
  readonly selectedDoctorIds = input<string[]>([]);
  readonly doctors = input<Doctor[]>([]);
  readonly doctorsLoading = input(false);
  readonly loading = input(false);
  readonly error = input('');
  readonly isEdit = input(false);
  readonly showAdminFields = input(true);

  readonly workingHoursChange = output<ClinicWorkingDay[]>();
  readonly selectedDoctorIdsChange = output<string[]>();
  readonly submitted = output<void>();
  readonly cancelled = output<void>();

  fullAddress(): string {
    const v = this.form().getRawValue();
    return [v.address, v.city, v.state, v.postalCode, v.country].filter(Boolean).join(', ');
  }
}
