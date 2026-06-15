import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorSearchResult, dayLabel } from '../../../../core/models/doctor.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-doctor-search-result-card',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './doctor-search-result-card.component.html',
  styleUrl: './doctor-search-result-card.component.scss',
})
export class DoctorSearchResultCardComponent {
  readonly doctor = input.required<DoctorSearchResult>();
  readonly dayLabel = dayLabel;

  languageNames(d: DoctorSearchResult): string {
    return (d.languages ?? []).map((l) => l.name).join(', ');
  }

  clinicLabels(d: DoctorSearchResult): string {
    return (d.clinics ?? []).map((c) => c.name + (c.city ? ` (${c.city})` : '')).join(', ');
  }

  availableDayLabels(d: DoctorSearchResult): string {
    return (d.availableDays ?? []).map((day) => dayLabel(day)).join(', ');
  }
}
