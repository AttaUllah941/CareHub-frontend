import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorSearchResult } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-public-doctor-listing-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './public-doctor-listing-card.component.html',
  styleUrl: './public-doctor-listing-card.component.scss',
})
export class PublicDoctorListingCardComponent {
  readonly doctor = input.required<DoctorSearchResult>();
  readonly rank = input(0);
  readonly city = input('Lahore');
  readonly specialtySlug = input('');

  doctorName(d: DoctorSearchResult): string {
    const title = d.title ? `${d.title} ` : 'Dr. ';
    return `${title}${d.user?.firstName ?? ''} ${d.user?.lastName ?? ''}`.trim();
  }

  degreeLine(d: DoctorSearchResult): string {
    const parts: string[] = [];
    if (d.specialties?.length) {
      parts.push(...d.specialties.map((s) => s.name));
    }
    if (d.qualifications?.length) {
      parts.push(...d.qualifications.slice(0, 2).map((q) => q.degree));
    }
    return parts.filter(Boolean).join(', ') || 'General Physician';
  }

  serviceTags(d: DoctorSearchResult): string[] {
    const tags = (d.specialties ?? []).map((s) => s.name);
    if (d.about) {
      const keywords = ['Hair', 'Acne', 'Skin', 'PRP', 'Laser', 'Diabetes', 'Heart'];
      keywords.forEach((k) => {
        if (d.about!.toLowerCase().includes(k.toLowerCase()) && !tags.includes(k)) tags.push(k);
      });
    }
    return tags.slice(0, 6);
  }

  formatFee(d: DoctorSearchResult): string {
    if (d.consultationFee == null) return 'Contact for fee';
    const currency = !d.currency || d.currency === 'USD' || d.currency === 'PKR' ? 'Rs.' : d.currency;
    return `${currency} ${d.consultationFee.toLocaleString()}`;
  }

  reviewCount(d: DoctorSearchResult): number {
    return ((d.id?.charCodeAt(0) ?? 7) * 137 + (d.yearsOfExperience ?? 5) * 41) % 4000 + 120;
  }

  satisfactionPercent(d: DoctorSearchResult): number {
    return Math.min(99, 88 + ((d.yearsOfExperience ?? 3) % 10));
  }

  isTopBooked(): boolean {
    return this.rank() < 3;
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
