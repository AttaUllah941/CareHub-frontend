import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicLab } from '../../../../core/models/lab.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { citySlugFromParamMap } from '../../../../shared/utils/city-route.util';
import { cityNameFromSlug, toPublicLabView } from '../../../marketplace/utils/marketplace-display.util';
import { LabsApiService } from '../../services/labs-api.service';

@Component({
  selector: 'app-labs-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './labs-city-page.component.html',
  styleUrl: './labs-city-page.component.scss',
})
export class LabsCityPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly labsApi = inject(LabsApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly labs = signal<PublicLab[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly cityName = computed(() => cityNameFromSlug(this.citySlug()));
  readonly pageTitle = computed(() => `Diagnostic Labs in ${this.cityName()}`);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = citySlugFromParamMap(params);
      this.citySlug.set(slug);
      this.loadLabs(slug);
    });
  }

  private loadLabs(citySlug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.labsApi.listPublic({ citySlug, limit: 50 }).subscribe({
      next: (res) => {
        this.labs.set(res.data.labs.map((lab) => toPublicLabView(lab)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.labs.set([]);
        this.loading.set(false);
      },
    });
  }
}
