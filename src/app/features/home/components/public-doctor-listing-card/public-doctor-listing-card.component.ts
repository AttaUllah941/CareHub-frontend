import { DecimalPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorSearchResult } from '../../../../core/models/doctor.model';
import { VideoConsultationModalComponent } from '../video-consultation-modal/video-consultation-modal.component';
import { ClinicAppointmentModalComponent } from '../clinic-appointment-modal/clinic-appointment-modal.component';

@Component({
  selector: 'app-public-doctor-listing-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, VideoConsultationModalComponent, ClinicAppointmentModalComponent],
  templateUrl: './public-doctor-listing-card.component.html',
  styleUrl: './public-doctor-listing-card.component.scss',
})
export class PublicDoctorListingCardComponent {
  readonly doctor = input.required<DoctorSearchResult>();
  readonly rank = input(0);
  readonly city = input('Lahore');
  readonly specialtySlug = input('');

  readonly videoModalOpen = signal(false);
  readonly appointmentModalOpen = signal(false);
  readonly preselectedClinicId = signal<string | undefined>(undefined);

  openVideoModal(): void {
    this.videoModalOpen.set(true);
  }

  closeVideoModal(): void {
    this.videoModalOpen.set(false);
  }

  openAppointmentModal(clinicId?: string): void {
    this.preselectedClinicId.set(clinicId);
    this.appointmentModalOpen.set(true);
  }

  closeAppointmentModal(): void {
    this.appointmentModalOpen.set(false);
    this.preselectedClinicId.set(undefined);
  }

  doctorName(d: DoctorSearchResult): string {
    const title = d.title ? `${d.title} ` : 'Dr. ';
    return `${title}${d.user?.firstName ?? ''} ${d.user?.lastName ?? ''}`.trim();
  }

  specialtyLine(d: DoctorSearchResult): string {
    const names = (d.specialties ?? []).map((s) => s.name);
    if (names.length) return names.join(', ');
    return 'General Physician';
  }

  degreeLine(d: DoctorSearchResult): string {
    const degrees = (d.qualifications ?? []).map((q) => q.degree);
    if (degrees.length) return degrees.join(', ');
    return '';
  }

  formatFee(d: DoctorSearchResult): string {
    if (d.consultationFee == null) return 'Contact for fee';
    return `Rs. ${d.consultationFee.toLocaleString('en-PK')}`;
  }

  reviewCount(d: DoctorSearchResult): number {
    return ((d.id?.charCodeAt(0) ?? 7) * 137 + (d.yearsOfExperience ?? 5) * 41) % 4000 + 120;
  }

  rating(d: DoctorSearchResult): string {
    const base = 4.5 + ((d.yearsOfExperience ?? 5) % 5) * 0.1;
    return Math.min(4.9, base).toFixed(1);
  }

  waitTime(d: DoctorSearchResult): string {
    const mins = 10 + ((d.id?.charCodeAt(1) ?? 3) % 4) * 5;
    return `Under ${mins} Min`;
  }

  isPlatinumDoctor(): boolean {
    return this.rank() < 2;
  }

  showDiscount(rank: number): boolean {
    return rank % 2 === 0;
  }

  doctorProfileLink(): string[] {
    return ['/doctors', this.doctor().id];
  }

  doctorProfileQueryParams(): { city: string; specialty?: string } {
    const params: { city: string; specialty?: string } = { city: this.city() };
    const slug = this.specialtySlug() || this.doctor().specialties?.[0]?.slug;
    if (slug) params.specialty = slug;
    return params;
  }
}
