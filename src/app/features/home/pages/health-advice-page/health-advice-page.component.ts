import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ASK_DOCTOR_STATS,
  MEDICAL_QUESTIONS,
  PAKISTAN_CITIES,
  SymptomItem,
} from '../../data/home-content';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AskQuestionModalComponent } from '../../components/ask-question-modal/ask-question-modal.component';

@Component({
  selector: 'app-health-advice-page',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent, DecimalPipe, AskQuestionModalComponent],
  templateUrl: './health-advice-page.component.html',
  styleUrl: './health-advice-page.component.scss',
})
export class HealthAdvicePageComponent {
  private readonly router = inject(Router);

  protected readonly stats = ASK_DOCTOR_STATS;
  protected readonly cities = PAKISTAN_CITIES;
  protected readonly selectedCity = signal('Lahore');
  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('All');
  protected readonly askQuestionOpen = signal(false);

  protected readonly categories = [
    'All',
    ...Array.from(new Set(MEDICAL_QUESTIONS.map((q) => q.category))),
  ];

  protected readonly questions = MEDICAL_QUESTIONS;

  protected readonly filteredQuestions = () => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.questions.filter((q) => {
      const matchesCategory = category === 'All' || q.category === category;
      const matchesQuery =
        !query ||
        q.question.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  };

  askQuestion(): void {
    this.askQuestionOpen.set(true);
  }

  closeAskQuestion(): void {
    this.askQuestionOpen.set(false);
  }

  consultSpecialist(specialtySlug: string): void {
    this.router.navigate(['/find-doctors', specialtySlug], {
      queryParams: { city: this.selectedCity() },
    });
  }
}
