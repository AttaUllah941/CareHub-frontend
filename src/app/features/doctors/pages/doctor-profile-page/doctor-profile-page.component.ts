import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorProfileCardComponent } from '../../components/doctor-profile-card/doctor-profile-card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-doctor-profile-page',
  standalone: true,
  imports: [RouterLink, DoctorProfileCardComponent, ButtonComponent, AlertComponent],
  templateUrl: './doctor-profile-page.component.html',
  styleUrl: './doctor-profile-page.component.scss',
})
export class DoctorProfilePageComponent implements OnInit {
  protected readonly doctorService = inject(DoctorService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.doctorService.clearError();
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      if (id) this.doctorService.loadDoctor(id);
    });
  }

  onVerify(status: 'VERIFIED' | 'REJECTED'): void {
    const doctor = this.doctorService.selectedDoctor();
    if (!doctor) return;
    const notes = status === 'REJECTED' ? prompt('Rejection reason (optional):') ?? undefined : undefined;
    this.doctorService.verifyDoctor(doctor.id, { verificationStatus: status, verificationNotes: notes });
  }

  onDelete(id: string): void {
    if (confirm('Deactivate this doctor?')) this.doctorService.deleteDoctor(id);
  }
}
