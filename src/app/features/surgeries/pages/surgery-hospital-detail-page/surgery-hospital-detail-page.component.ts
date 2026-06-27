import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SurgeryHospitalView, SurgeryProcedure } from '../../../../core/models/surgery.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { PublicDoctorListingCardComponent } from '../../../doctors/components/public-doctor-listing-card/public-doctor-listing-card.component';
import { PublicSurgeryCardComponent } from '../../components/public-surgery-card/public-surgery-card.component';
import {
  cityNameFromSlug,
  toSurgeryHospitalView,
  toSurgeryProcedureView,
} from '../../../marketplace/utils/marketplace-display.util';
import { HospitalsApiService } from '../../../hospitals/services/hospitals-api.service';
import { SurgeriesApiService } from '../../services/surgeries-api.service';

@Component({
  selector: 'app-surgery-hospital-detail-page',
  standalone: true,
  imports: [RouterLink, PublicSurgeryCardComponent, PublicDoctorListingCardComponent],
  templateUrl: './surgery-hospital-detail-page.component.html',
  styleUrl: './surgery-hospital-detail-page.component.scss',
})
export class SurgeryHospitalDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly hospitalsApi = inject(HospitalsApiService);
  private readonly surgeriesApi = inject(SurgeriesApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly hospitalSlug = signal('');
  readonly hospital = signal<SurgeryHospitalView | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly cityName = computed(() => cityNameFromSlug(this.citySlug()));

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('citySlug') ?? 'lahore';
      const slug = params.get('hospitalSlug') ?? '';
      this.citySlug.set(city);
      this.hospitalSlug.set(slug);
      this.loadHospital(city, slug);
    });
  }

  private loadHospital(citySlug: string, slug: string): void {
    if (!slug) {
      this.hospital.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.hospitalsApi.getPublicDetail(citySlug, slug).subscribe({
      next: (hospitalRes) => {
        const rawHospital = hospitalRes.data.hospital;
        this.surgeriesApi.listPublicProcedures({ limit: 100 }).subscribe({
          next: (procedureRes) => {
            const procedures = procedureRes.data.procedures
              .map(toSurgeryProcedureView)
              .filter((procedure) => procedure.hospitalIds.includes(rawHospital.id));
            this.hospital.set(toSurgeryHospitalView(rawHospital, procedures));
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(this.apiErrorService.getMessage(err));
            this.hospital.set(toSurgeryHospitalView(rawHospital, []));
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.hospital.set(null);
        this.loading.set(false);
      },
    });
  }
}
