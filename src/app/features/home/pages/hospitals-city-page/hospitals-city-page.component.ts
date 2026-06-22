import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getHospitalCityName, getHospitalsByCitySlug, PublicHospital } from '../../data/dummy-hospitals.data';

@Component({
  selector: 'app-hospitals-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hospitals-city-page.component.html',
  styleUrl: './hospitals-city-page.component.scss',
})
export class HospitalsCityPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly citySlug = signal('lahore');
  readonly hospitals = signal<PublicHospital[]>([]);

  readonly cityName = computed(() => getHospitalCityName(this.citySlug()));
  readonly pageTitle = computed(() => `Best Hospitals in ${this.cityName()}`);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = params.get('citySlug') ?? 'lahore';
      this.citySlug.set(slug);
      this.hospitals.set(getHospitalsByCitySlug(slug));
    });
  }
}
