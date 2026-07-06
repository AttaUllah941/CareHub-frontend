import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  DISEASES,
  PAKISTAN_CITIES,
  SERVICE_CARDS,
  SYMPTOMS,
  TESTIMONIALS,
  TRUST_BADGES,
} from '../../data/home-content';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  protected readonly referenceData = inject(ReferenceDataService);
  private readonly router = inject(Router);

  protected readonly cities = PAKISTAN_CITIES;
  protected readonly serviceCards = SERVICE_CARDS;
  protected readonly symptoms = SYMPTOMS;
  protected readonly diseases = DISEASES;
  protected readonly testimonials = TESTIMONIALS;
  protected readonly trustBadges = TRUST_BADGES;

  readonly selectedCity = signal('Lahore');
  searchSpecialty = '';
  searchQuery = '';

  ngOnInit(): void {
    this.referenceData.loadSpecialties();
  }

  selectCity(city: string): void {
    this.selectedCity.set(city);
  }

  browseSpecialty(slug: string): void {
    this.router.navigate(['/find-doctors', slug], {
      queryParams: { city: this.selectedCity() },
    });
  }

  searchDoctors(): void {
    const slug = this.searchSpecialty || this.referenceData.specialtyChips()[0]?.slug || 'general-physician';
    this.router.navigate(['/find-doctors', slug], {
      queryParams: {
        city: this.selectedCity(),
        q: this.searchQuery || undefined,
      },
    });
  }
}
