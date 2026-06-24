import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { citySlugFromParamMap } from '../../../../shared/utils/city-route.util';
import { getLabCityName, getLabsByCitySlug, PublicLab } from '../../data/dummy-labs.data';
@Component({
  selector: 'app-labs-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './labs-city-page.component.html',
  styleUrl: './labs-city-page.component.scss',
})
export class LabsCityPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly citySlug = signal('lahore');
  readonly labs = signal<PublicLab[]>([]);

  readonly cityName = computed(() => getLabCityName(this.citySlug()));
  readonly pageTitle = computed(() => `Diagnostic Labs in ${this.cityName()}`);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = citySlugFromParamMap(params);
      this.citySlug.set(slug);
      this.labs.set(getLabsByCitySlug(slug));
    });  }
}
