import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PAKISTAN_CITIES, SYMPTOMS } from '../../data/home-content';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { navigateToHealthTopic } from '../../utils/health-topic-navigation.util';

@Component({
  selector: 'app-symptoms-page',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  templateUrl: './symptoms-page.component.html',
  styleUrl: './symptoms-page.component.scss',
})
export class SymptomsPageComponent {
  private readonly router = inject(Router);

  protected readonly symptoms = SYMPTOMS;
  protected readonly cities = PAKISTAN_CITIES;
  protected readonly selectedCity = signal('Lahore');
  protected readonly searchQuery = signal('');

  protected readonly filteredSymptoms = () => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.symptoms;
    return this.symptoms.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query),
    );
  };

  browseSymptom(item: (typeof SYMPTOMS)[number]): void {
    navigateToHealthTopic(this.router, item, this.selectedCity());
  }
}
