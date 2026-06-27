import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DoctorSearchResult } from '../../../../core/models/doctor.model';
import { PublicHospitalView } from '../../../../core/models/hospital.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { PublicDoctorListingCardComponent } from '../../../doctors/components/public-doctor-listing-card/public-doctor-listing-card.component';
import {
  cityNameFromSlug,
  doctorSummaryToSearchResult,
  toPublicHospitalView,
} from '../../../marketplace/utils/marketplace-display.util';
import { HospitalsApiService } from '../../services/hospitals-api.service';

@Component({
  selector: 'app-hospital-detail-page',
  standalone: true,
  imports: [RouterLink, PublicDoctorListingCardComponent],
  templateUrl: './hospital-detail-page.component.html',
  styleUrl: './hospital-detail-page.component.scss',
})
export class HospitalDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly hospitalsApi = inject(HospitalsApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly hospitalSlug = signal('');
  readonly hospital = signal<PublicHospitalView | null>(null);
  readonly doctors = signal<DoctorSearchResult[]>([]);
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
      next: (res) => {
        const raw = res.data.hospital;
        const view = toPublicHospitalView(raw);
        const city = cityNameFromSlug(citySlug);
        this.hospital.set(view);
        this.doctors.set((raw.doctors ?? []).map((d) => doctorSummaryToSearchResult(d, city)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.hospital.set(null);
        this.doctors.set([]);
        this.loading.set(false);
      },
    });
  }
}
