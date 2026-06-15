import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  DaySchedule,
  DEFAULT_WEEKLY_SCHEDULE,
  SLOT_DURATION_OPTIONS,
  VacationDate,
} from '../../../../core/models/doctor-availability.model';
import { DoctorAvailabilityService } from '../../services/doctor-availability.service';
import { WeeklyScheduleCalendarComponent } from '../../components/weekly-schedule-calendar/weekly-schedule-calendar.component';
import { VacationCalendarComponent } from '../../components/vacation-calendar/vacation-calendar.component';
import { SlotPreviewPanelComponent } from '../../components/slot-preview-panel/slot-preview-panel.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-doctor-availability-page',
  standalone: true,
  imports: [
    WeeklyScheduleCalendarComponent,
    VacationCalendarComponent,
    SlotPreviewPanelComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './doctor-availability-page.component.html',
  styleUrl: './doctor-availability-page.component.scss',
})
export class DoctorAvailabilityPageComponent implements OnInit {
  protected readonly availabilityService = inject(DoctorAvailabilityService);

  readonly slotDurationOptions = SLOT_DURATION_OPTIONS;
  readonly weeklySchedule = signal<DaySchedule[]>(DEFAULT_WEEKLY_SCHEDULE);
  readonly vacationDates = signal<VacationDate[]>([]);
  readonly slotDurationMinutes = signal(30);
  readonly timezone = signal(Intl.DateTimeFormat().resolvedOptions().timeZone);
  readonly previewDate = signal('');

  constructor() {
    effect(() => {
      const availability = this.availabilityService.availability();
      if (!availability) return;

      this.weeklySchedule.set(structuredClone(availability.weeklySchedule));
      this.vacationDates.set(structuredClone(availability.vacationDates));
      this.slotDurationMinutes.set(availability.slotDurationMinutes);
      this.timezone.set(availability.timezone);

      const date = this.previewDate() || new Date().toISOString().slice(0, 10);
      if (!this.previewDate()) {
        this.previewDate.set(date);
      }
      this.availabilityService.loadSlotsPreview(date);
    });
  }

  ngOnInit(): void {
    this.availabilityService.clearError();
    this.availabilityService.clearSuccessMessage();
    this.availabilityService.loadAvailability();
  }

  save(): void {
    this.availabilityService.updateAvailability({
      weeklySchedule: this.weeklySchedule(),
      vacationDates: this.vacationDates(),
      slotDurationMinutes: this.slotDurationMinutes(),
      timezone: this.timezone(),
    });
  }

  onPreviewDateChange(date: string): void {
    this.previewDate.set(date);
  }

  loadPreview(date: string): void {
    this.availabilityService.loadSlotsPreview(date);
  }
}
