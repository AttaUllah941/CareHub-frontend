import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvailabilitySlot, DAY_OPTIONS, TIME_SLOT_OPTIONS } from '../../models/doctor-portal.model';
import { DoctorPortalService } from '../../services/doctor-portal.service';

@Component({
  selector: 'app-doctor-schedule-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './doctor-schedule-page.component.html',
  styleUrl: './doctor-schedule-page.component.scss',
})
export class DoctorSchedulePageComponent {
  readonly portal = inject(DoctorPortalService);
  readonly dayOptions = DAY_OPTIONS;
  readonly timeOptions = TIME_SLOT_OPTIONS;
  readonly selectedDay = signal(1);
  readonly slotStart = signal('10:00 AM');
  readonly slotEnd = signal('02:00 PM');
  readonly saved = signal(false);

  slots(): AvailabilitySlot[] {
    return this.portal.currentProfile()?.availability ?? [];
  }

  addSlot(): void {
    const day = this.dayOptions.find((d) => d.value === this.selectedDay());
    if (!day) return;
    const profile = this.portal.currentProfile();
    if (!profile) return;
    const slot: AvailabilitySlot = {
      day: day.value,
      dayLabel: day.label,
      startTime: this.slotStart(),
      endTime: this.slotEnd(),
    };
    const updated = [...profile.availability.filter((s) => s.day !== slot.day), slot].sort(
      (a, b) => a.day - b.day,
    );
    this.portal.setAvailability(updated);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  removeSlot(day: number): void {
    const profile = this.portal.currentProfile();
    if (!profile) return;
    this.portal.setAvailability(profile.availability.filter((s) => s.day !== day));
  }
}
