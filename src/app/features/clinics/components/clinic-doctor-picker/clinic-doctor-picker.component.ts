import { Component, input, output } from '@angular/core';
import { Doctor } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-clinic-doctor-picker',
  standalone: true,
  templateUrl: './clinic-doctor-picker.component.html',
  styleUrl: './clinic-doctor-picker.component.scss',
})
export class ClinicDoctorPickerComponent {
  readonly doctors = input<Doctor[]>([]);
  readonly selectedIds = input<string[]>([]);
  readonly loading = input(false);
  readonly selectedIdsChange = output<string[]>();

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggle(id: string): void {
    const current = this.selectedIds();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    this.selectedIdsChange.emit(next);
  }

  doctorLabel(doctor: Doctor): string {
    const name = doctor.user
      ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`
      : doctor.title ?? 'Doctor';
    return name;
  }
}
