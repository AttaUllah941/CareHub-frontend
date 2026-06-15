import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { LanguageTableComponent } from '../../components/language-table/language-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LanguageListQuery } from '../../../../core/models/language.model';

@Component({
  selector: 'app-language-list-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    LanguageTableComponent,
    PaginationComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './language-list-page.component.html',
  styleUrl: './language-list-page.component.scss',
})
export class LanguageListPageComponent implements OnInit {
  protected readonly languageService = inject(LanguageService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.languageService.clearError();
    this.languageService.clearSuccessMessage();
    this.languageService.loadLanguages({});
  }

  onSearch(value: string): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.languageService.loadLanguages({ search: value, page: 1 }), 400);
  }

  onFilter(query: Partial<LanguageListQuery>): void {
    this.languageService.loadLanguages(query);
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this language?')) this.languageService.deleteLanguage(id);
  }
}
