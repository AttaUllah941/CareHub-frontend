import { Component, inject } from '@angular/core';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-consultations-page',
  standalone: true,
  templateUrl: './doctor-consultations-page.component.html',
  styleUrl: './doctor-consultations-page.component.scss',
})
export class DoctorConsultationsPageComponent {
  readonly portal = inject(DoctorPortalService);

  videoAppointments() {
    return this.portal.myAppointments().filter(
      (a) => a.type === 'video' && (a.status === 'accepted' || a.status === 'pending'),
    );
  }

  startConsultation(patientName: string): void {
    console.group('Video Consultation Started');
    console.log({ patient: patientName, room: `carehub-${Date.now()}` });
    console.groupEnd();
    alert(`Starting video consultation with ${patientName}. (Demo — integrate WebRTC provider here.)`);
  }
}
