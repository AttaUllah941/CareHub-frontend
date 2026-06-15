import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorSearchQuery, DAY_OF_WEEK_OPTIONS } from '../../../../core/models/doctor.model';
import { MedicalSpecialty } from '../../../../core/models/medical-specialty.model';
import { Language } from '../../../../core/models/language.model';
import { Clinic } from '../../../../core/models/clinic.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-doctor-search-filter-panel',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './doctor-search-filter-panel.component.html',
  styleUrl: './doctor-search-filter-panel.component.scss',
})
export class DoctorSearchFilterPanelComponent {
  readonly query = input.required<DoctorSearchQuery>();
  readonly specialties = input<MedicalSpecialty[]>([]);
  readonly languages = input<Language[]>([]);
  readonly clinics = input<Clinic[]>([]);
  readonly loading = input(false);

  readonly filterChange = output<Partial<DoctorSearchQuery>>();
  readonly resetFilters = output<void>();

  readonly days = DAY_OF_WEEK_OPTIONS;

  onChange(field: keyof DoctorSearchQuery, value: string): void {
    this.filterChange.emit({ [field]: value, page: 1 });
  }

  onReset(): void {
    this.resetFilters.emit();
  }
}
