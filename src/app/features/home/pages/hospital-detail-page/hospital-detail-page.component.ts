import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicDoctorListingCardComponent } from '../../components/public-doctor-listing-card/public-doctor-listing-card.component';
import { getHospitalBySlug, getHospitalCityName, PublicHospital } from '../../data/dummy-hospitals.data';

@Component({
  selector: 'app-hospital-detail-page',
  standalone: true,
  imports: [RouterLink, PublicDoctorListingCardComponent],
  templateUrl: './hospital-detail-page.component.html',
  styleUrl: './hospital-detail-page.component.scss',
})
export class HospitalDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly citySlug = signal('lahore');
  readonly hospitalSlug = signal('');
  readonly hospital = signal<PublicHospital | null>(null);

  readonly cityName = computed(() => getHospitalCityName(this.citySlug()));

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('citySlug') ?? 'lahore';
      const slug = params.get('hospitalSlug') ?? '';
      this.citySlug.set(city);
      this.hospitalSlug.set(slug);
      this.hospital.set(getHospitalBySlug(city, slug) ?? null);
    });
  }
}
