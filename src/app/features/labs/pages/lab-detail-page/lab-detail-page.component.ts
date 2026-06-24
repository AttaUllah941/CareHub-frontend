import { Component, computed, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

import { PublicLabTestCardComponent } from '../../components/public-lab-test-card/public-lab-test-card.component';

import { getLabBySlug, getLabCityName, PublicLab } from '../../data/dummy-labs.data';



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



  readonly citySlug = signal('lahore');

  readonly labSlug = signal('');

  readonly lab = signal<PublicLab | null>(null);

  readonly testSearchQuery = signal('');

  readonly currentPage = signal(1);



  readonly cityName = computed(() => getLabCityName(this.citySlug()));



  readonly filteredTests = computed(() => {

    const tests = this.lab()?.tests ?? [];

    const query = this.testSearchQuery().trim().toLowerCase();

    if (!query) return tests;

    return tests.filter((test) => test.name.toLowerCase().includes(query));

  });



  readonly totalTestPages = computed(() =>

    Math.max(1, Math.ceil(this.filteredTests().length / TESTS_PER_PAGE)),

  );



  readonly paginatedTests = computed(() => {

    const tests = this.filteredTests();

    const page = Math.min(this.currentPage(), this.totalTestPages());

    const start = (page - 1) * TESTS_PER_PAGE;

    return tests.slice(start, start + TESTS_PER_PAGE);

  });



  readonly hasActiveSearch = computed(() => this.testSearchQuery().trim().length > 0);



  constructor() {

    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {

      const city = params.get('citySlug') ?? 'lahore';

      const slug = params.get('labSlug') ?? '';

      this.citySlug.set(city);

      this.labSlug.set(slug);

      this.lab.set(getLabBySlug(city, slug) ?? null);

      this.testSearchQuery.set('');

      this.currentPage.set(1);

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


