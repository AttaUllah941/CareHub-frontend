import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { PatientProfileCardComponent } from '../../components/patient-profile-card/patient-profile-card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-patient-detail-page',
  standalone: true,
  imports: [RouterLink, PatientProfileCardComponent, ButtonComponent, AlertComponent],
  templateUrl: './patient-detail-page.component.html',
  styleUrl: './patient-detail-page.component.scss',
})
export class PatientDetailPageComponent implements OnInit {
  protected readonly patientService = inject(PatientService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.patientService.clearError();
    this.patientService.loadPatient(id);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this patient?')) this.patientService.deletePatient(id);
  }
}
