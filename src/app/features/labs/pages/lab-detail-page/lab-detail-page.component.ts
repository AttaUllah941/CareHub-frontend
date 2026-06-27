import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LabTest, PublicLab } from '../../../../core/models/lab.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PublicLabTestCardComponent } from '../../components/public-lab-test-card/public-lab-test-card.component';
import { cityNameFromSlug, toPublicLabView } from '../../../marketplace/utils/marketplace-display.util';
import { LabsApiService } from '../../services/labs-api.service';

const TESTS_PER_PAGE = 9;

@Component({
  selector: 'app-lab-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule, PublicLabTestCardComponent, PaginationComponent],
  templateUrl: './lab-detail-page.component.html',
  styleUrl: './lab-detail-page.component.scss',
})
export class LabDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly labsApi = inject(LabsApiService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly citySlug = signal('lahore');
  readonly labSlug = signal('');
  readonly lab = signal<PublicLab | null>(null);
  readonly tests = signal<LabTest[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly testSearchQuery = signal('');
  readonly currentPage = signal(1);

  readonly cityName = computed(() => cityNameFromSlug(this.citySlug()));

  readonly filteredTests = computed(() => {
    const query = this.testSearchQuery().trim().toLowerCase();
    if (!query) return this.tests();
    return this.tests().filter((test) => test.name.toLowerCase().includes(query));
  });

  readonly totalTestPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredTests().length / TESTS_PER_PAGE)),
  );

  readonly paginatedTests = computed(() => {
    const page = Math.min(this.currentPage(), this.totalTestPages());
    const start = (page - 1) * TESTS_PER_PAGE;
    return this.filteredTests().slice(start, start + TESTS_PER_PAGE);
  });

  readonly hasActiveSearch = computed(() => this.testSearchQuery().trim().length > 0);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const city = params.get('citySlug') ?? 'lahore';
      const slug = params.get('labSlug') ?? '';
      this.citySlug.set(city);
      this.labSlug.set(slug);
      this.testSearchQuery.set('');
      this.currentPage.set(1);
      this.loadLab(city, slug);
    });
  }

  private loadLab(citySlug: string, slug: string): void {
    if (!slug) {
      this.lab.set(null);
      this.tests.set([]);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.labsApi.listPublic({ citySlug, limit: 50 }).subscribe({
      next: (res) => {
        const match = res.data.labs.find((item) => item.slug === slug);
        if (!match) {
          this.lab.set(null);
          this.tests.set([]);
          this.loading.set(false);
          return;
        }

        this.labsApi.listPublicTests(match.id, { limit: 100 }).subscribe({
          next: (testRes) => {
            const labView = toPublicLabView(match, testRes.data.tests);
            this.tests.set(labView.tests ?? []);
            this.lab.set(labView);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(this.apiErrorService.getMessage(err));
            this.lab.set(toPublicLabView(match, []));
            this.tests.set([]);
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        this.error.set(this.apiErrorService.getMessage(err));
        this.lab.set(null);
        this.tests.set([]);
        this.loading.set(false);
      },
    });
  }

  onTestSearchChange(query: string): void {
    this.testSearchQuery.set(query);
    this.currentPage.set(1);
  }

  clearTestSearch(): void {
    this.testSearchQuery.set('');
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
