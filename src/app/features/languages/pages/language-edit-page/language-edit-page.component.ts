import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { LanguageFormComponent } from '../../components/language-form/language-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-language-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LanguageFormComponent, AlertComponent],
  templateUrl: './language-edit-page.component.html',
  styleUrl: './language-edit-page.component.scss',
})
export class LanguageEditPageComponent implements OnInit {
  protected readonly languageService = inject(LanguageService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  languageId = '';

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    nativeName: [''],
    description: [''],
    isActive: [true],
  });

  constructor() {
    effect(() => {
      const language = this.languageService.selectedLanguage();
      if (language && language.id === this.languageId) {
        this.form.patchValue({
          name: language.name,
          nativeName: language.nativeName ?? '',
          description: language.description ?? '',
          isActive: language.isActive,
        });
      }
    });
  }

  ngOnInit(): void {
    this.languageService.clearError();
    this.route.paramMap.subscribe((p) => {
      this.languageId = p.get('id') ?? '';
      if (this.languageId) this.languageService.loadLanguage(this.languageId);
    });
  }

  onUpdate(): void {
    if (this.form.invalid) return;
    this.languageService.updateLanguage(this.languageId, this.form.getRawValue());
  }
}
