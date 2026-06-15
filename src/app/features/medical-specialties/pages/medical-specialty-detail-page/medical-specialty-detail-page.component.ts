import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MedicalSpecialtyService } from '../../services/medical-specialty.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-medical-specialty-detail-page',
  standalone: true,
  imports: [DatePipe, RouterLink, ButtonComponent, AlertComponent],
  templateUrl: './medical-specialty-detail-page.component.html',
  styleUrl: './medical-specialty-detail-page.component.scss',
})
export class MedicalSpecialtyDetailPageComponent implements OnInit {
  protected readonly specialtyService = inject(MedicalSpecialtyService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.specialtyService.clearError();
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      if (id) this.specialtyService.loadSpecialty(id);
    });
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this medical specialty?')) this.specialtyService.deleteSpecialty(id);
  }
}
