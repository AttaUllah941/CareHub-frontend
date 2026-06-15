import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { MedicalSpecialtyService } from '../../../medical-specialties/services/medical-specialty.service';
import { LanguageService } from '../../../languages/services/language.service';
import { ClinicService } from '../../../clinics/services/clinic.service';
import { DoctorSearchFilterPanelComponent } from '../../components/doctor-search-filter-panel/doctor-search-filter-panel.component';
import { DoctorSearchResultCardComponent } from '../../components/doctor-search-result-card/doctor-search-result-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { DEFAULT_DOCTOR_SEARCH_QUERY, DoctorSearchQuery } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-search-page',
  standalone: true,
  imports: [
    RouterLink,
    DoctorSearchFilterPanelComponent,
    DoctorSearchResultCardComponent,
    PaginationComponent,
    AlertComponent,
  ],
  templateUrl: './doctor-search-page.component.html',
  styleUrl: './doctor-search-page.component.scss',
})
export class DoctorSearchPageComponent implements OnInit {
  protected readonly doctorService = inject(DoctorService);
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  protected readonly languageService = inject(LanguageService);
  protected readonly clinicService = inject(ClinicService);

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.doctorService.clearError();
    this.specialtyService.loadAllSpecialties();
    this.languageService.loadAllLanguages();
    this.clinicService.loadAllClinics();
    this.doctorService.searchDoctors({});
  }

  onNameSearch(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.doctorService.searchDoctors({ name: value, page: 1 }), 400);
  }

  onFilter(query: Partial<DoctorSearchQuery>): void {
    if (query.name !== undefined) {
      this.onNameSearch(query.name);
      return;
    }
    this.doctorService.searchDoctors(query);
  }

  onReset(): void {
    this.doctorService.searchDoctors({ ...DEFAULT_DOCTOR_SEARCH_QUERY });
  }

  onPageChange(page: number): void {
    this.doctorService.searchDoctors({ page });
  }
}
