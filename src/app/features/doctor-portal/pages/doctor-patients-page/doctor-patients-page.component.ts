import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-patients-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './doctor-patients-page.component.html',
  styleUrl: './doctor-patients-page.component.scss',
})
export class DoctorPatientsPageComponent {
  readonly portal = inject(DoctorPortalService);
  readonly selectedId = signal<string | null>(null);

  selectPatient(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }

  selectedPatient() {
    const id = this.selectedId();
    if (!id) return null;
    return this.portal.myPatients().find((p) => p.id === id) ?? null;
  }

  patientPrescriptions(patientId: string) {
    return this.portal.myPrescriptions().filter((rx) => rx.patientId === patientId);
  }
}
