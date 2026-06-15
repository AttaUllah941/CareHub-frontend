import { Component, inject, OnInit, signal } from '@angular/core';
import { ConsultationService } from '../../services/consultation.service';
import { ConsultationTableComponent } from '../../components/consultation-table/consultation-table.component';
import { ConsultationDetailComponent } from '../../components/consultation-detail/consultation-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Consultation } from '../../../../core/models/consultation.model';

@Component({
  selector: 'app-consultation-list-page',
  standalone: true,
  imports: [ConsultationTableComponent, ConsultationDetailComponent, AlertComponent],
  templateUrl: './consultation-list-page.component.html',
  styleUrl: './consultation-list-page.component.scss',
})
export class ConsultationListPageComponent implements OnInit {
  protected readonly consultationService = inject(ConsultationService);
  readonly selected = signal<Consultation | null>(null);

  ngOnInit(): void {
    this.consultationService.clearError();
    this.consultationService.clearSuccessMessage();
    this.consultationService.loadMyConsultations();
  }

  onView(consultation: Consultation): void {
    this.selected.set(consultation);
  }

  closeDetail(): void {
    this.selected.set(null);
  }
}
