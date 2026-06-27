import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Hospital } from '../../../../core/models/hospital.model';
import { SurgeryHospitalView } from '../../../../core/models/surgery.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { citySlugFromParamMap } from '../../../../shared/utils/city-route.util';
import {
  cityNameFromSlug,
  toPublicHospitalView,
  toSurgeryHospitalView,
  toSurgeryProcedureView,
} from '../../../marketplace/utils/marketplace-display.util';
import { HospitalsApiService } from '../../../hospitals/services/hospitals-api.service';
import { SurgeriesApiService } from '../../services/surgeries-api.service';

@Component({
  selector: 'app-surgery-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './surgery-city-page.component.html',
  styleUrl: './surgery-city-page.component.scss',
})
export class SurgeryCityPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly hospitalsApi = inject(HospitalsApiService);
  private readonly surgeriesApi = inject(SurgeriesApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly hospitals = signal<SurgeryHospitalView[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly cityName = computed(() => cityNameFromSlug(this.citySlug()));
  readonly pageTitle = computed(() => `Surgical Hospitals in ${this.cityName()}`);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = citySlugFromParamMap(params);
      this.citySlug.set(slug);
      this.loadHospitals(slug);
    });
  }

  private loadHospitals(citySlug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.hospitalsApi.listPublic({ citySlug, limit: 50 }).subscribe({
      next: (hospitalRes) => {
        this.surgeriesApi.listPublicProcedures({ limit: 100 }).subscribe({
          next: (procedureRes) => {
            const procedures = procedureRes.data.procedures.map(toSurgeryProcedureView);
            const hospitalIdsWithSurgery = new Set(
              procedures.flatMap((procedure) => procedure.hospitalIds),
            );

            const views = hospitalRes.data.hospitals
              .filter((hospital) => hospitalIdsWithSurgery.has(hospital.id))
              .map((hospital) => {
                const hospitalProcedures = procedures.filter((procedure) =>
                  procedure.hospitalIds.includes(hospital.id),
                );
                return toSurgeryHospitalView(hospital, hospitalProcedures);
              });

            this.hospitals.set(views);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(this.apiErrorService.getMessage(err));
            this.hospitals.set([]);
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.hospitals.set([]);
        this.loading.set(false);
      },
    });
  }
}
