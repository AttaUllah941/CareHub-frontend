import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { citySlugFromParamMap } from '../../utils/city-route.util';
import {  getMedicineCityName,
  getPharmaciesByCitySlug,
  PublicPharmacy,
} from '../../data/dummy-medicines.data';

@Component({
  selector: 'app-medicines-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './medicines-city-page.component.html',
  styleUrl: './medicines-city-page.component.scss',
})
export class MedicinesCityPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly citySlug = signal('lahore');
  readonly pharmacies = signal<PublicPharmacy[]>([]);

  readonly cityName = computed(() => getMedicineCityName(this.citySlug()));
  readonly pageTitle = computed(() => `Pharmacies in ${this.cityName()}`);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = citySlugFromParamMap(params);
      this.citySlug.set(slug);
      this.pharmacies.set(getPharmaciesByCitySlug(slug));
    });
  }
}
