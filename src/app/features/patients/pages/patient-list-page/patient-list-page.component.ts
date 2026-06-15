import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { PatientTableComponent } from '../../components/patient-table/patient-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { BLOOD_GROUP_OPTIONS, PatientListQuery } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-list-page',
  standalone: true,
  imports: [FormsModule, RouterLink, PatientTableComponent, PaginationComponent, ButtonComponent, AlertComponent],
  templateUrl: './patient-list-page.component.html',
  styleUrl: './patient-list-page.component.scss',
})
export class PatientListPageComponent implements OnInit {
  protected readonly patientService = inject(PatientService);
  readonly bloodGroups = BLOOD_GROUP_OPTIONS;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.patientService.clearError();
    this.patientService.clearSuccessMessage();
    this.patientService.loadPatients({});
  }

  onSearch(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.patientService.loadPatients({ search: value, page: 1 }), 400);
  }

  onFilter(query: Partial<PatientListQuery>): void {
    this.patientService.loadPatients(query);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this patient?')) this.patientService.deletePatient(id);
  }
}
