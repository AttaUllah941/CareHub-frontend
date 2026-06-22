import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicDoctorListingCardComponent } from '../../components/public-doctor-listing-card/public-doctor-listing-card.component';
import { PublicSurgeryCardComponent } from '../../components/public-surgery-card/public-surgery-card.component';
import {
  getSurgeryCityName,
  getSurgeryHospitalBySlug,
  SurgeryHospital,
} from '../../data/dummy-surgery.data';

@Component({
  selector: 'app-surgery-hospital-detail-page',
  standalone: true,
  imports: [RouterLink, PublicSurgeryCardComponent, PublicDoctorListingCardComponent],
  templateUrl: './surgery-hospital-detail-page.component.html',
  styleUrl: './surgery-hospital-detail-page.component.scss',
})
export class SurgeryHospitalDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly citySlug = signal('lahore');
  readonly hospitalSlug = signal('');
  readonly hospital = signal<SurgeryHospital | null>(null);

  readonly cityName = computed(() => getSurgeryCityName(this.citySlug()));

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('citySlug') ?? 'lahore';
      const slug = params.get('hospitalSlug') ?? '';
      this.citySlug.set(city);
      this.hospitalSlug.set(slug);
      this.hospital.set(getSurgeryHospitalBySlug(city, slug) ?? null);
    });
  }
}
