import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { TRUST_BADGES } from '../../data/home-content';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent {
  protected readonly trustBadges = TRUST_BADGES;
}
