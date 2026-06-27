import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

/** Legacy component — doctor login uses unified `/auth/login`. */
@Component({
  selector: 'app-doctor-login-page',
  standalone: true,
  template: '',
})
export class DoctorLoginPageComponent {
  private readonly router = inject(Router);

  constructor() {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/doctor/dashboard' },
      replaceUrl: true,
    });
  }
}
