import { Component, inject } from '@angular/core';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-earnings-page',
  standalone: true,
  templateUrl: './doctor-earnings-page.component.html',
  styleUrl: './doctor-earnings-page.component.scss',
})
export class DoctorEarningsPageComponent {
  readonly portal = inject(DoctorPortalService);
}
