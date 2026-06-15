import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicalSpecialty } from '../../../../core/models/medical-specialty.model';

@Component({
  selector: 'app-medical-specialty-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './medical-specialty-table.component.html',
  styleUrl: './medical-specialty-table.component.scss',
})
export class MedicalSpecialtyTableComponent {
  readonly specialties = input<MedicalSpecialty[]>([]);
  readonly loading = input(false);
  readonly deleteSpecialty = output<string>();
}
