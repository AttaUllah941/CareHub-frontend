import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClinicService } from '../../services/clinic.service';
import { ClinicMapPreviewComponent } from '../../components/clinic-map-preview/clinic-map-preview.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { DAY_NAMES } from '../../../../core/models/doctor-availability.model';

@Component({
  selector: 'app-clinic-detail-page',
  standalone: true,
  imports: [RouterLink, ClinicMapPreviewComponent, ButtonComponent, AlertComponent],
  templateUrl: './clinic-detail-page.component.html',
  styleUrl: './clinic-detail-page.component.scss',
})
export class ClinicDetailPageComponent implements OnInit {
  protected readonly clinicService = inject(ClinicService);
  private readonly route = inject(ActivatedRoute);
  readonly dayNames = DAY_NAMES;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.clinicService.clearError();
    this.clinicService.loadClinic(id);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this clinic?')) this.clinicService.deleteClinic(id);
  }

  fullAddress(clinic: { address?: string; city?: string; state?: string; postalCode?: string; country?: string }): string {
    return [clinic.address, clinic.city, clinic.state, clinic.postalCode, clinic.country].filter(Boolean).join(', ');
  }
}
