import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicDoctorApiService } from '../../services/public-doctor-api.service';
import { PublicDoctorListingCardComponent } from '../../components/public-doctor-listing-card/public-doctor-listing-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PAKISTAN_CITIES } from '../../../home/data/home-content';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { DoctorSearchResult, PaginationMeta } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-find-doctors-page',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe, PublicDoctorListingCardComponent, PaginationComponent],
  templateUrl: './find-doctors-page.component.html',
  styleUrl: './find-doctors-page.component.scss',
})
export class FindDoctorsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly publicDoctorApi = inject(PublicDoctorApiService);
  private readonly referenceData = inject(ReferenceDataService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly cities = PAKISTAN_CITIES;
  readonly specialtySlug = signal('');
  readonly selectedCity = signal('Lahore');
  readonly searchName = signal('');
  readonly maxFee = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly doctors = signal<DoctorSearchResult[]>([]);
  readonly pagination = signal<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });

  readonly activeFilters = signal<string[]>([]);

  readonly pageTitle = computed(() => {
    const total = this.pagination().total;
    const specialty = this.referenceData.getSpecialtyPluralTitle(this.specialtySlug());
    const city = this.selectedCity();
    const countLabel = total > 0 ? `${total.toLocaleString()} ` : '';
    return `${countLabel}Best ${specialty} In ${city} | Top Specialists`;
  });

  readonly breadcrumbSpecialty = computed(() =>
    this.referenceData.getSpecialtyName(this.specialtySlug()),
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = params.get('specialtySlug') ?? 'general-physician';
      this.specialtySlug.set(slug);
      this.loadDoctors(1);
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('city');
      if (city) this.selectedCity.set(city);
    });
  }

  ngOnInit(): void {
    this.referenceData.loadSpecialties();
    const city = this.route.snapshot.queryParamMap.get('city');
    if (city) this.selectedCity.set(city);
  }

  loadDoctors(page = 1): void {
    this.loading.set(true);
    this.error.set(null);

    const query: Record<string, string | number> = {
      page,
      limit: 10,
      specialtySlug: this.specialtySlug(),
      city: this.selectedCity(),
      sortBy: this.activeFilters().includes('Top Reviewed') ? 'averageRating' : 'yearsOfExperience',
      sortOrder: 'desc',
    };

    const name = this.searchName().trim();
    if (name) query['name'] = name;

    const fee = this.maxFee();
    if (fee) query['maxFee'] = fee;

    this.publicDoctorApi.searchDoctors(query).subscribe({
      next: (res) => {
        this.doctors.set(res.data.doctors);
        this.pagination.set(res.data.pagination);
        this.loading.set(false);
      },
      error: (err) => {
        this.doctors.set([]);
        this.pagination.set({ page: 1, limit: 10, total: 0, totalPages: 0 });
        this.error.set(this.apiErrorService.getMessage(err));
        this.loading.set(false);
      },
    });
  }

  onSearch(): void {
    this.loadDoctors(1);
  }

  onCityChange(city: string): void {
    this.selectedCity.set(city);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { city },
      queryParamsHandling: 'merge',
    });
    this.loadDoctors(1);
  }

  toggleFilter(filter: string): void {
    const isActive = this.activeFilters().includes(filter);

    if (isActive) {
      this.activeFilters.update((current) => current.filter((f) => f !== filter));
      if (filter === 'Fee Upto 500') this.maxFee.set('');
    } else {
      this.activeFilters.update((current) => [...current, filter]);
      if (filter === 'Fee Upto 500') this.maxFee.set('500');
    }

    this.loadDoctors(1);
  }

  clearFilters(): void {
    this.activeFilters.set([]);
    this.maxFee.set('');
    this.searchName.set('');
    this.loadDoctors(1);
  }

  onPageChange(page: number): void {
    this.loadDoctors(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isFilterActive(filter: string): boolean {
    return this.activeFilters().includes(filter);
  }
}
