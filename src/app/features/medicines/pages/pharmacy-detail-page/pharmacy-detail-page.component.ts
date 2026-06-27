import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PharmacyMedicine, PublicPharmacyView } from '../../../../core/models/medicine.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PublicMedicineCardComponent } from '../../components/public-medicine-card/public-medicine-card.component';
import {
  cityNameFromSlug,
  formatMedicinePrice,
  groupMedicinesByPharmacy,
  toPublicPharmacyView,
} from '../../../marketplace/utils/marketplace-display.util';
import { MedicinesApiService } from '../../services/medicines-api.service';

const MEDICINES_PER_PAGE = 9;

@Component({
  selector: 'app-pharmacy-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule, PublicMedicineCardComponent, PaginationComponent],
  templateUrl: './pharmacy-detail-page.component.html',
  styleUrl: './pharmacy-detail-page.component.scss',
})
export class PharmacyDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly medicinesApi = inject(MedicinesApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly pharmacySlug = signal('');
  readonly pharmacy = signal<PublicPharmacyView | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly medicineSearchQuery = signal('');
  readonly currentPage = signal(1);

  readonly cityName = computed(() => cityNameFromSlug(this.citySlug()));

  readonly filteredMedicines = computed((): PharmacyMedicine[] => {
    const medicines = this.pharmacy()?.medicines ?? [];
    const query = this.medicineSearchQuery().trim().toLowerCase();
    if (!query) return medicines;
    return medicines.filter((m) => m.name.toLowerCase().includes(query));
  });

  readonly totalMedicinePages = computed(() =>
    Math.max(1, Math.ceil(this.filteredMedicines().length / MEDICINES_PER_PAGE)),
  );

  readonly paginatedMedicines = computed(() => {
    const page = Math.min(this.currentPage(), this.totalMedicinePages());
    const start = (page - 1) * MEDICINES_PER_PAGE;
    return this.filteredMedicines().slice(start, start + MEDICINES_PER_PAGE);
  });

  readonly hasActiveSearch = computed(() => this.medicineSearchQuery().trim().length > 0);
  readonly formatPrice = formatMedicinePrice;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('citySlug') ?? 'lahore';
      const slug = params.get('pharmacySlug') ?? '';
      this.citySlug.set(city);
      this.pharmacySlug.set(slug);
      this.medicineSearchQuery.set('');
      this.currentPage.set(1);
      this.loadPharmacy(city, slug);
    });
  }

  private loadPharmacy(citySlug: string, slug: string): void {
    if (!slug) {
      this.pharmacy.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.medicinesApi.listPublic({ limit: 100 }).subscribe({
      next: (res) => {
        const grouped = groupMedicinesByPharmacy(res.data.medicines);
        const match = grouped.find(
          (entry) => entry.pharmacy.citySlug === citySlug && entry.pharmacy.slug === slug,
        );
        this.pharmacy.set(match ? toPublicPharmacyView(match.pharmacy, match.medicines) : null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.pharmacy.set(null);
        this.loading.set(false);
      },
    });
  }

  onMedicineSearchChange(query: string): void {
    this.medicineSearchQuery.set(query);
    this.currentPage.set(1);
  }

  clearMedicineSearch(): void {
    this.medicineSearchQuery.set('');
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
