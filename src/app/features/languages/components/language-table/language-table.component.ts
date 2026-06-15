import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language } from '../../../../core/models/language.model';

@Component({
  selector: 'app-language-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './language-table.component.html',
  styleUrl: './language-table.component.scss',
})
export class LanguageTableComponent {
  readonly languages = input<Language[]>([]);
  readonly loading = input(false);
  readonly deleteLanguage = output<string>();
}
