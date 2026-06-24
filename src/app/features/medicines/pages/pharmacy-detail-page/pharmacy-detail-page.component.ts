import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PublicMedicineCardComponent } from '../../components/public-medicine-card/public-medicine-card.component';
import {
  formatMedicinePrice,
  getMedicineCityName,
  getPharmacyBySlug,
  PublicPharmacy,
} from '../../data/dummy-medicines.data';

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

  readonly citySlug = signal('lahore');
  readonly pharmacySlug = signal('');
  readonly pharmacy = signal<PublicPharmacy | null>(null);
  readonly medicineSearchQuery = signal('');
  readonly currentPage = signal(1);

  readonly cityName = computed(() => getMedicineCityName(this.citySlug()));

  readonly filteredMedicines = computed(() => {
    const medicines = this.pharmacy()?.medicines ?? [];
    const query = this.medicineSearchQuery().trim().toLowerCase();
    if (!query) return medicines;
    return medicines.filter((m) => m.name.toLowerCase().includes(query));
  });

  readonly totalMedicinePages = computed(() =>
    Math.max(1, Math.ceil(this.filteredMedicines().length / MEDICINES_PER_PAGE)),
  );

  readonly paginatedMedicines = computed(() => {
    const medicines = this.filteredMedicines();
    const page = Math.min(this.currentPage(), this.totalMedicinePages());
    const start = (page - 1) * MEDICINES_PER_PAGE;
    return medicines.slice(start, start + MEDICINES_PER_PAGE);
  });

  readonly hasActiveSearch = computed(() => this.medicineSearchQuery().trim().length > 0);

  readonly formatPrice = formatMedicinePrice;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('citySlug') ?? 'lahore';
      const slug = params.get('pharmacySlug') ?? '';
      this.citySlug.set(city);
      this.pharmacySlug.set(slug);
      this.pharmacy.set(getPharmacyBySlug(city, slug) ?? null);
      this.medicineSearchQuery.set('');
      this.currentPage.set(1);
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
