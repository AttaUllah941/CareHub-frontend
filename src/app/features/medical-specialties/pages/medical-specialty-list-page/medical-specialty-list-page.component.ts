import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedicalSpecialtyService } from '../../services/medical-specialty.service';
import { MedicalSpecialtyTableComponent } from '../../components/medical-specialty-table/medical-specialty-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { MedicalSpecialtyListQuery } from '../../../../core/models/medical-specialty.model';

@Component({
  selector: 'app-medical-specialty-list-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MedicalSpecialtyTableComponent,
    PaginationComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './medical-specialty-list-page.component.html',
  styleUrl: './medical-specialty-list-page.component.scss',
})
export class MedicalSpecialtyListPageComponent implements OnInit {
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.specialtyService.clearError();
    this.specialtyService.clearSuccessMessage();
    this.specialtyService.loadSpecialties({});
  }

  onSearch(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.specialtyService.loadSpecialties({ search: value, page: 1 }), 400);
  }

  onFilter(query: Partial<MedicalSpecialtyListQuery>): void {
    this.specialtyService.loadSpecialties(query);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this medical specialty?')) this.specialtyService.deleteSpecialty(id);
  }
}
