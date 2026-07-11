import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../../auth/services/auth.service';
import { dashboardRouteForRole } from '../../../../core/utils/auth-navigation.util';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './unauthorized-page.component.html',
  styleUrl: './unauthorized-page.component.scss',
})
export class UnauthorizedPageComponent {
  private readonly authService = inject(AuthService);

  readonly dashboardRoute = computed(() => dashboardRouteForRole(this.authService.role()));
}
