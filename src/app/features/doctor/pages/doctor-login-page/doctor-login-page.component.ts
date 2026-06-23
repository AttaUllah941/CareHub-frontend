import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './doctor-login-page.component.html',
  styleUrl: './doctor-login-page.component.scss',
})
export class DoctorLoginPageComponent {
  private readonly portal = inject(DoctorPortalService);
  private readonly router = inject(Router);

  readonly email = signal('dr.ahmad@carehub.demo');
  readonly password = signal('');
  readonly error = signal('');
  readonly loading = signal(false);

  login(): void {
    this.error.set('');
    this.loading.set(true);
    const result = this.portal.login(this.email().trim(), this.password());
    this.loading.set(false);
    if (result.success) {
      this.router.navigate(['/doctor/dashboard']);
    } else {
      this.error.set(result.message);
    }
  }
}
