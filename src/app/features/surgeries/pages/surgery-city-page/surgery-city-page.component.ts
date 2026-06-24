import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { citySlugFromParamMap } from '../../../../shared/utils/city-route.util';
import {  getSurgeryCityName,
  getSurgeryHospitalsByCitySlug,
  SurgeryHospital,
} from '../../data/dummy-surgery.data';

@Component({
  selector: 'app-surgery-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './surgery-city-page.component.html',
  styleUrl: './surgery-city-page.component.scss',
})
export class SurgeryCityPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly citySlug = signal('lahore');
  readonly hospitals = signal<SurgeryHospital[]>([]);

  readonly cityName = computed(() => getSurgeryCityName(this.citySlug()));
  readonly pageTitle = computed(() => `Surgical Hospitals in ${this.cityName()}`);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = citySlugFromParamMap(params);
      this.citySlug.set(slug);
      this.hospitals.set(getSurgeryHospitalsByCitySlug(slug));
    });
  }
}
