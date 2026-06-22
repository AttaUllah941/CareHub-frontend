import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  DISEASES,
  PAKISTAN_CITIES,
  POPULAR_SPECIALTIES,
  SERVICE_CARDS,
  SYMPTOMS,
  TESTIMONIALS,
  TRUST_BADGES,
} from '../../data/home-content';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  protected readonly cities = PAKISTAN_CITIES;
  protected readonly specialties = POPULAR_SPECIALTIES;
  protected readonly serviceCards = SERVICE_CARDS;
  protected readonly symptoms = SYMPTOMS;
  protected readonly diseases = DISEASES;
  protected readonly testimonials = TESTIMONIALS;
  protected readonly trustBadges = TRUST_BADGES;

  readonly selectedCity = signal('Lahore');
  searchSpecialty = '';
  searchQuery = '';

  constructor(private readonly router: Router) {}

  selectCity(city: string): void {
    this.selectedCity.set(city);
  }

  browseSpecialty(slug: string): void {
    this.router.navigate(['/find-doctors', slug], {
      queryParams: { city: this.selectedCity() },
    });
  }

  searchDoctors(): void {
    const slug = this.searchSpecialty || 'general-practitioner';
    this.router.navigate(['/find-doctors', slug], {
      queryParams: {
        city: this.selectedCity(),
        q: this.searchQuery || undefined,
      },
    });
  }
}
