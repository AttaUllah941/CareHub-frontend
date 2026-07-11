import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ASK_DOCTOR_STATS,
  DISEASES,
  MEDICAL_QUESTIONS,
  PAKISTAN_CITIES,
  SERVICE_CARDS,
  SYMPTOMS,
  SymptomItem,
  TESTIMONIALS,
  TRUST_BADGES,
} from '../../data/home-content';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { navigateToHealthTopic } from '../../utils/health-topic-navigation.util';
import { AskQuestionModalComponent } from '../../components/ask-question-modal/ask-question-modal.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent, AskQuestionModalComponent],
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
  protected readonly featuredSymptoms = SYMPTOMS.slice(0, 8);
  protected readonly featuredDiseases = DISEASES.slice(0, 8);
  protected readonly featuredQuestions = MEDICAL_QUESTIONS.slice(0, 3);
  protected readonly askDoctorStats = ASK_DOCTOR_STATS;
  protected readonly testimonials = TESTIMONIALS;
  protected readonly trustBadges = TRUST_BADGES;

  readonly selectedCity = signal('Lahore');
  readonly askQuestionOpen = signal(false);
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
    const slug = this.searchSpecialty.trim() || 'all';
    const queryParams: Record<string, string> = {
      city: this.selectedCity(),
    };

    const q = this.searchQuery.trim();
    if (q) {
      queryParams['q'] = q;
    }

    this.router.navigate(['/find-doctors', slug], { queryParams });
  }

  browseSymptom(item: SymptomItem): void {
    navigateToHealthTopic(this.router, item, this.selectedCity());
  }

  browseDisease(item: SymptomItem): void {
    navigateToHealthTopic(this.router, item, this.selectedCity());
  }

  askQuestion(): void {
    this.askQuestionOpen.set(true);
  }

  closeAskQuestion(): void {
    this.askQuestionOpen.set(false);
  }
}
