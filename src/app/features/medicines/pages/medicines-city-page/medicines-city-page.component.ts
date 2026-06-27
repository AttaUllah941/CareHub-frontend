import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicPharmacyView } from '../../../../core/models/medicine.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { citySlugFromParamMap } from '../../../../shared/utils/city-route.util';
import {
  cityNameFromSlug,
  groupMedicinesByPharmacy,
  toPublicPharmacyView,
} from '../../../marketplace/utils/marketplace-display.util';
import { MedicinesApiService } from '../../services/medicines-api.service';

@Component({
  selector: 'app-medicines-city-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './medicines-city-page.component.html',
  styleUrl: './medicines-city-page.component.scss',
})
export class MedicinesCityPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly medicinesApi = inject(MedicinesApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly pharmacies = signal<PublicPharmacyView[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly cityName = computed(() => cityNameFromSlug(this.citySlug()));
  readonly pageTitle = computed(() => `Pharmacies in ${this.cityName()}`);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = citySlugFromParamMap(params);
      this.citySlug.set(slug);
      this.loadPharmacies(slug);
    });
  }

  private loadPharmacies(citySlug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.medicinesApi.listPublic({ limit: 100 }).subscribe({
      next: (res) => {
        const grouped = groupMedicinesByPharmacy(res.data.medicines)
          .filter((entry) => entry.pharmacy.citySlug === citySlug)
          .map((entry) => toPublicPharmacyView(entry.pharmacy, entry.medicines));
        this.pharmacies.set(grouped);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.pharmacies.set([]);
        this.loading.set(false);
      },
    });
  }
}
