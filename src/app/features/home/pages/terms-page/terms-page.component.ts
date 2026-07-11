import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './terms-page.component.html',
  styleUrl: './terms-page.component.scss',
})
export class TermsPageComponent {
  protected readonly lastUpdated = 'July 2026';
}
