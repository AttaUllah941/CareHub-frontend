import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { PublicDoctorApiService } from '../../services/public-doctor-api.service';
import { PublicDoctorListingCardComponent } from '../../components/public-doctor-listing-card/public-doctor-listing-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DoctorCardSkeletonComponent } from '../../../../shared/components/skeleton/doctor-card-skeleton.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PAKISTAN_CITIES } from '../../../home/data/home-content';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { DoctorSearchResult, PaginationMeta } from '../../../../core/models/doctor.model';

type DoctorSort = 'experience' | 'rating' | 'fee';

const PAGE_SIZE = 10;
const DEFAULT_CITY = 'Lahore';
const SEARCH_DEBOUNCE_MS = 400;

const SORT_QUERY: Record<DoctorSort, { sortBy: string; sortOrder: 'asc' | 'desc' }> = {
  experience: { sortBy: 'yearsOfExperience', sortOrder: 'desc' },
  rating: { sortBy: 'averageRating', sortOrder: 'desc' },
  fee: { sortBy: 'consultationFee', sortOrder: 'asc' },
};

const EMPTY_PAGINATION: PaginationMeta = { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 };

interface SearchRequest {
  page: number;
  city: string;
  specialtySlug: string;
  name: string;
  maxFee: string;
  sort: DoctorSort;
}

/**
 * Listing page. The URL is the single source of truth for filters
 * (?city, ?q, ?maxFee, ?sort, ?page) so back/forward, refresh and shared links all work,
 * and every filter change triggers exactly one (cancellable) API request.
 */
@Component({
  selector: 'app-find-doctors-page',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DecimalPipe,
    PublicDoctorListingCardComponent,
    PaginationComponent,
    DoctorCardSkeletonComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './find-doctors-page.component.html',
  styleUrl: './find-doctors-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindDoctorsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly publicDoctorApi = inject(PublicDoctorApiService);
  private readonly referenceData = inject(ReferenceDataService);
  private readonly apiErrorService = inject(ApiErrorService);

  private readonly request$ = new Subject<SearchRequest>();
  private readonly searchText$ = new Subject<string>();

  readonly cities = PAKISTAN_CITIES;
  readonly feeOptions = [
    { value: '', label: 'Any fee' },
    { value: '500', label: 'Up to Rs 500' },
    { value: '1000', label: 'Up to Rs 1,000' },
    { value: '2000', label: 'Up to Rs 2,000' },
    { value: '5000', label: 'Up to Rs 5,000' },
  ];

  readonly specialtySlug = signal('');
  readonly selectedCity = signal(DEFAULT_CITY);
  /** Text in the search box (may be ahead of the URL while debouncing). */
  readonly searchName = signal('');
  readonly healthCondition = signal('');
  readonly maxFee = signal('');
  readonly sort = signal<DoctorSort>('experience');

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly doctors = signal<DoctorSearchResult[]>([]);
  readonly pagination = signal<PaginationMeta>(EMPTY_PAGINATION);

  /** Skeletons only for the very first load; later refreshes keep results on screen. */
  readonly showSkeleton = computed(() => this.loading() && this.doctors().length === 0);
  readonly hasActiveFilters = computed(
    () => !!this.searchName().trim() || !!this.maxFee() || this.sort() !== 'experience',
  );

  readonly pageTitle = computed(() => {
    const total = this.pagination().total;
    const slug = this.specialtySlug();
    const specialty = slug ? this.referenceData.getSpecialtyPluralTitle(slug) : 'Doctors';
    const countLabel = total > 0 ? `${total.toLocaleString()} ` : '';
    return `${countLabel}${specialty} in ${this.selectedCity()}`;
  });

  readonly breadcrumbSpecialty = computed(() => {
    const slug = this.specialtySlug();
    return slug ? this.referenceData.getSpecialtyName(slug) : 'All specialities';
  });

  constructor() {
    // Search pipeline is subscribed BEFORE the route listener so the first request is never dropped.
    this.request$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        // switchMap cancels the in-flight request when filters change quickly.
        switchMap((request) =>
          this.publicDoctorApi.searchDoctors(this.toApiQuery(request)).pipe(
            catchError((err) => {
              this.doctors.set([]);
              this.pagination.set(EMPTY_PAGINATION);
              this.error.set(this.apiErrorService.getMessage(err));
              this.loading.set(false);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (!res) return;
        this.doctors.set(res.data.doctors);
        this.pagination.set(res.data.pagination);
        this.loading.set(false);
      });

    this.searchText$
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((text) =>
        this.updateParams({ q: text.trim() || null, name: null, condition: null }),
      );

    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, query]) => {
        const rawSlug = params.get('specialtySlug') ?? 'all';
        this.specialtySlug.set(rawSlug === 'all' ? '' : rawSlug);
        this.selectedCity.set(query.get('city') || DEFAULT_CITY);
        this.maxFee.set(query.get('maxFee') ?? '');

        const sort = query.get('sort');
        this.sort.set(sort === 'rating' || sort === 'fee' ? sort : 'experience');

        const condition = query.get('condition');
        this.healthCondition.set(condition ?? '');
        if (!condition) {
          const name = query.get('q') ?? query.get('name') ?? '';
          // Don't clobber text the user is still typing.
          if (name.trim() !== this.searchName().trim()) {
            this.searchName.set(name);
          }
        } else {
          this.searchName.set('');
        }

        const page = Math.max(1, parseInt(query.get('page') ?? '1', 10) || 1);
        this.request$.next({
          page,
          city: this.selectedCity(),
          specialtySlug: this.specialtySlug().trim(),
          name: this.searchName().trim(),
          maxFee: this.maxFee(),
          sort: this.sort(),
        });
      });
  }

  ngOnInit(): void {
    this.referenceData.loadSpecialties();
  }

  onSearchInput(value: string): void {
    this.searchName.set(value);
    this.searchText$.next(value);
  }

  /** Enter / button — apply immediately, skipping the debounce. */
  onSearch(): void {
    this.updateParams({ q: this.searchName().trim() || null, name: null, condition: null });
  }

  onCityChange(city: string): void {
    this.updateParams({ city });
  }

  onFeeChange(value: string): void {
    this.updateParams({ maxFee: value || null });
  }

  onSortChange(sort: DoctorSort): void {
    this.updateParams({ sort: sort === 'experience' ? null : sort });
  }

  toggleTopRated(): void {
    this.onSortChange(this.sort() === 'rating' ? 'experience' : 'rating');
  }

  clearFilters(): void {
    this.searchName.set('');
    this.updateParams({ q: null, name: null, condition: null, maxFee: null, sort: null });
  }

  onPageChange(page: number): void {
    this.updateParams({ page: page > 1 ? page : null }, false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /** Any filter change resets pagination unless told otherwise. */
  private updateParams(changes: Params, resetPage = true): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: resetPage ? { ...changes, page: null } : changes,
      queryParamsHandling: 'merge',
    });
  }

  private toApiQuery(request: SearchRequest): Record<string, string | number> {
    const query: Record<string, string | number> = {
      page: request.page,
      limit: PAGE_SIZE,
      city: request.city,
      ...SORT_QUERY[request.sort],
    };

    if (request.specialtySlug) query['specialtySlug'] = request.specialtySlug;
    if (request.name) query['name'] = request.name;
    if (request.maxFee) query['maxFee'] = request.maxFee;

    return query;
  }
}
