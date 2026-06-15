import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClinicService } from '../../services/clinic.service';
import { ClinicTableComponent } from '../../components/clinic-table/clinic-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ClinicListQuery } from '../../../../core/models/clinic.model';

@Component({
  selector: 'app-clinic-list-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ClinicTableComponent, PaginationComponent, ButtonComponent, AlertComponent],
  templateUrl: './clinic-list-page.component.html',
  styleUrl: './clinic-list-page.component.scss',
})
export class ClinicListPageComponent implements OnInit {
  protected readonly clinicService = inject(ClinicService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.clinicService.clearError();
    this.clinicService.clearSuccessMessage();
    this.clinicService.loadClinics({});
  }

  onSearch(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.clinicService.loadClinics({ search: value, page: 1 }), 400);
  }

  onFilter(query: Partial<ClinicListQuery>): void {
    this.clinicService.loadClinics(query);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this clinic?')) this.clinicService.deleteClinic(id);
  }
}
