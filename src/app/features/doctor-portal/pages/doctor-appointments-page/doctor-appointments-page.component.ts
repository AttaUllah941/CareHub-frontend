import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AppointmentStatus } from '../../models/doctor-portal.model';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-appointments-page',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './doctor-appointments-page.component.html',
  styleUrl: './doctor-appointments-page.component.scss',
})
export class DoctorAppointmentsPageComponent {
  readonly portal = inject(DoctorPortalService);
  readonly filter = signal<'all' | AppointmentStatus>('all');

  filteredAppointments() {
    const f = this.filter();
    const list = this.portal.myAppointments();
    if (f === 'all') return list;
    return list.filter((a) => a.status === f);
  }

  setFilter(f: string): void {
    this.filter.set(f as 'all' | AppointmentStatus);
  }

  accept(id: string): void {
    this.portal.updateAppointmentStatus(id, 'accepted');
  }

  reject(id: string): void {
    this.portal.updateAppointmentStatus(id, 'rejected');
  }

  complete(id: string): void {
    this.portal.updateAppointmentStatus(id, 'completed');
  }

  statusBadge(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      pending: 'bg-amber-100 text-amber-800',
      accepted: 'bg-sky-100 text-sky-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-gray-100 text-gray-600',
    };
    return map[status];
  }
}
