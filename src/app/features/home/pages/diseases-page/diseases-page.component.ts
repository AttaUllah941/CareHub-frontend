import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DISEASES, PAKISTAN_CITIES } from '../../data/home-content';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { navigateToHealthTopic } from '../../utils/health-topic-navigation.util';

@Component({
  selector: 'app-diseases-page',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  templateUrl: './diseases-page.component.html',
  styleUrl: './diseases-page.component.scss',
})
export class DiseasesPageComponent {
  private readonly router = inject(Router);

  protected readonly diseases = DISEASES;
  protected readonly cities = PAKISTAN_CITIES;
  protected readonly selectedCity = signal('Lahore');
  protected readonly searchQuery = signal('');

  protected readonly filteredDiseases = () => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.diseases;
    return this.diseases.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query),
    );
  };

  browseDisease(item: (typeof DISEASES)[number]): void {
    navigateToHealthTopic(this.router, item, this.selectedCity());
  }
}
