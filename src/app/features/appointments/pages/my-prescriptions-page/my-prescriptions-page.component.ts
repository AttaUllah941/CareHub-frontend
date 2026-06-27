import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { DoctorPrescription } from '../../../doctor-portal/models/doctor-portal.model';
import { PrescriptionsApiService } from '../../../doctor-portal/services/prescriptions-api.service';

@Component({
  selector: 'app-my-prescriptions-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-prescriptions-page.component.html',
  styleUrl: './my-prescriptions-page.component.scss',
})
export class MyPrescriptionsPageComponent implements OnInit {
  private readonly prescriptionsApi = inject(PrescriptionsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly prescriptions = signal<DoctorPrescription[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadPrescriptions();
    }
  }

  loadPrescriptions(): void {
    this.loading.set(true);
    this.error.set(null);

    this.prescriptionsApi.listPatientMine({ page: 1, limit: 50 }).subscribe({
      next: (data) => {
        this.prescriptions.set(data.prescriptions);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }
}
