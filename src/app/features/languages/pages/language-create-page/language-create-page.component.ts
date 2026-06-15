import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { LanguageFormComponent } from '../../components/language-form/language-form.component';

@Component({
  selector: 'app-language-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LanguageFormComponent],
  templateUrl: './language-create-page.component.html',
  styleUrl: './language-create-page.component.scss',
})
export class LanguageCreatePageComponent implements OnInit {
  protected readonly languageService = inject(LanguageService);
  protected readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.pattern(/^[a-z]{2,3}$/)]],
    nativeName: [''],
    description: [''],
  });

  ngOnInit(): void {
    this.languageService.clearError();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.languageService.createLanguage(this.form.getRawValue());
  }
}
