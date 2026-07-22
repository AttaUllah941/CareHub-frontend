import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { NotificationBellComponent } from '../../core/components/notification-bell/notification-bell.component';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';

interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

@Component({
  selector: 'app-pharmacy-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationBellComponent, IconComponent],
  templateUrl: './pharmacy-layout.component.html',
  styleUrl: './pharmacy-layout.component.scss',
})
export class PharmacyLayoutComponent {
  readonly authService = inject(AuthService);

  readonly navItems: NavItem[] = [
    { label: 'Orders', path: '/pharmacy/orders', icon: 'cart' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
