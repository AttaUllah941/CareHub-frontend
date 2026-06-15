import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-language-detail-page',
  standalone: true,
  imports: [DatePipe, RouterLink, ButtonComponent, AlertComponent],
  templateUrl: './language-detail-page.component.html',
  styleUrl: './language-detail-page.component.scss',
})
export class LanguageDetailPageComponent implements OnInit {
  protected readonly languageService = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.languageService.clearError();
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      if (id) this.languageService.loadLanguage(id);
    });
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this language?')) this.languageService.deleteLanguage(id);
  }
}
