import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicHospitalView } from '../../../../core/models/hospital.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { citySlugFromParamMap } from '../../../../shared/utils/city-route.util';
import {
  cityNameFromSlug,
  toPublicHospitalView,
} from '../../../marketplace/utils/marketplace-display.util';
import { HospitalsApiService } from '../../services/hospitals-api.service';

@Component({
  selector: 'app-hospitals-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hospitals-city-page.component.html',
  styleUrl: './hospitals-city-page.component.scss',
})
export class HospitalsCityPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly hospitalsApi = inject(HospitalsApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly hospitals = signal<PublicHospitalView[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly cityName = computed(() => cityNameFromSlug(this.citySlug()));
  readonly pageTitle = computed(() => `Best Hospitals in ${this.cityName()}`);

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
      next: (res) => {
        this.hospitals.set(res.data.hospitals.map(toPublicHospitalView));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.hospitals.set([]);
        this.loading.set(false);
      },
    });
  }
}
