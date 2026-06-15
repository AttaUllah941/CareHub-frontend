import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsultationService } from '../../services/consultation.service';
import { ConsultationTableComponent } from '../../components/consultation-table/consultation-table.component';
import { ConsultationDetailComponent } from '../../components/consultation-detail/consultation-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Consultation } from '../../../../core/models/consultation.model';

@Component({
  selector: 'app-admin-consultation-list-page',
  standalone: true,
  imports: [
    FormsModule,
    ConsultationTableComponent,
    ConsultationDetailComponent,
    AlertComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-consultation-list-page.component.html',
  styleUrl: './admin-consultation-list-page.component.scss',
})
export class AdminConsultationListPageComponent implements OnInit {
  protected readonly consultationService = inject(ConsultationService);
  readonly search = signal('');
  readonly viewing = signal<Consultation | null>(null);

  ngOnInit(): void {
    this.consultationService.clearError();
    this.consultationService.clearSuccessMessage();
    this.consultationService.loadConsultations();
  }

  onSearch(): void {
    this.consultationService.loadConsultations({ search: this.search(), page: 1 });
  }

  onPageChange(page: number): void {
    this.consultationService.loadConsultations({ page });
  }

  onView(consultation: Consultation): void {
    this.viewing.set(consultation);
  }

  onDelete(consultation: Consultation): void {
    if (confirm('Remove this consultation record?')) {
      this.consultationService.deleteConsultation(consultation.id);
    }
  }
}
