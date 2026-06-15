import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorTableComponent } from '../../components/doctor-table/doctor-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { MedicalSpecialtyService } from '../../../medical-specialties/services/medical-specialty.service';
import { DoctorListQuery } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-list-page',
  standalone: true,
  imports: [FormsModule, RouterLink, DoctorTableComponent, PaginationComponent, ButtonComponent, AlertComponent],
  templateUrl: './doctor-list-page.component.html',
  styleUrl: './doctor-list-page.component.scss',
})
export class DoctorListPageComponent implements OnInit {
  protected readonly doctorService = inject(DoctorService);
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.doctorService.clearError();
    this.doctorService.clearSuccessMessage();
    this.doctorService.loadDoctors({});
    this.specialtyService.loadAllSpecialties();
  }

  onSearch(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.doctorService.loadDoctors({ search: value, page: 1 }), 400);
  }

  onFilter(query: Partial<DoctorListQuery>): void {
    this.doctorService.loadDoctors(query);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this doctor?')) this.doctorService.deleteDoctor(id);
  }
}
