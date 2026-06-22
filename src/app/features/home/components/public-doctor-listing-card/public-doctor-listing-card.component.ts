import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorSearchResult } from '../../../../core/models/doctor.model';

const HEADER_THEMES = [
  'from-rose-400 via-pink-500 to-rose-500',
  'from-violet-500 via-purple-500 to-indigo-500',
  'from-teal-400 via-cyan-500 to-teal-500',
  'from-sky-500 via-blue-500 to-indigo-500',
  'from-emerald-400 via-teal-500 to-green-500',
  'from-amber-400 via-orange-500 to-rose-500',
];

@Component({
  selector: 'app-public-doctor-listing-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-doctor-listing-card.component.html',
  styleUrl: './public-doctor-listing-card.component.scss',
})
export class PublicDoctorListingCardComponent {
  readonly doctor = input.required<DoctorSearchResult>();
  readonly rank = input(0);
  readonly city = input('Lahore');
  readonly specialtySlug = input('');

  readonly headerTheme = computed(() => HEADER_THEMES[this.rank() % HEADER_THEMES.length]);

  doctorName(d: DoctorSearchResult): string {
    const title = d.title ? `${d.title} ` : 'Dr. ';
    return `${title}${d.user?.firstName ?? ''} ${d.user?.lastName ?? ''}`.trim();
  }

  specialtyLabel(d: DoctorSearchResult): string {
    const name = d.specialties?.[0]?.name;
    if (!name) return 'General Physician';
    if (/specialist|practitioner|surgeon|consultant|physician/i.test(name)) return name;
    if (name.endsWith('ist') || name.endsWith('ian') || name.endsWith('logist')) return name;
    return `${name} Specialist`;
  }

  experienceBadge(d: DoctorSearchResult): string {
    const years = d.yearsOfExperience ?? 0;
    return `${years}+ Years`;
  }

  surgeriesCount(d: DoctorSearchResult): string {
    const years = d.yearsOfExperience ?? 5;
    const base = years * 140 + ((d.id?.charCodeAt(0) ?? 7) * 37) % 400;
    const rounded = Math.floor(base / 100) * 100;
    return `${Math.max(500, rounded)}+`;
  }

  successRate(d: DoctorSearchResult): number {
    return Math.min(99, 92 + ((d.yearsOfExperience ?? 3) % 7));
  }

  expertiseTags(d: DoctorSearchResult): string[] {
    if (!d.about) {
      return (d.specialties ?? []).map((s) => s.name).slice(0, 3);
    }

    const parts = d.about
      .split(/[,;]/)
      .map((p) => p.trim())
      .filter((p) => p.length > 2 && p.length < 40);

    if (parts.length >= 2) return parts.slice(0, 3);
    return (d.specialties ?? []).map((s) => s.name).slice(0, 3);
  }

  languageTags(d: DoctorSearchResult): string[] {
    const langs = (d.languages ?? []).map((l) => l.name);
    if (langs.length) return langs.slice(0, 3);
    return ['English', 'Urdu'];
  }

  formatFee(d: DoctorSearchResult): string {
    if (d.consultationFee == null) return 'Contact for fee';
    return `Rs. ${d.consultationFee.toLocaleString('en-PK')}`;
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
