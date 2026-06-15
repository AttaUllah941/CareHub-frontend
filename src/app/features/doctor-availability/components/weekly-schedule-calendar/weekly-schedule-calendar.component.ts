import { Component, input, output } from '@angular/core';
import { DaySchedule, DAY_NAMES } from '../../../../core/models/doctor-availability.model';

@Component({
  selector: 'app-weekly-schedule-calendar',
  standalone: true,
  templateUrl: './weekly-schedule-calendar.component.html',
  styleUrl: './weekly-schedule-calendar.component.scss',
})
export class WeeklyScheduleCalendarComponent {
  readonly schedule = input.required<DaySchedule[]>();
  readonly scheduleChange = output<DaySchedule[]>();

  readonly dayNames = DAY_NAMES;

  get orderedSchedule(): DaySchedule[] {
    return [...this.schedule()].sort((a, b) => {
      const order = (d: number) => (d === 0 ? 7 : d);
      return order(a.dayOfWeek) - order(b.dayOfWeek);
    });
  }

  updateDay(dayOfWeek: number, patch: Partial<DaySchedule>): void {
    const updated = this.schedule().map((d) =>
      d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d,
    );
    this.scheduleChange.emit(updated);
  }

  updateBreak(dayOfWeek: number, index: number, field: 'startTime' | 'endTime', value: string): void {
    const updated = this.schedule().map((d) => {
      if (d.dayOfWeek !== dayOfWeek) return d;
      const breaks = [...d.breaks];
      breaks[index] = { ...breaks[index], [field]: value };
      return { ...d, breaks };
    });
    this.scheduleChange.emit(updated);
  }

  addBreak(dayOfWeek: number): void {
    const updated = this.schedule().map((d) =>
      d.dayOfWeek === dayOfWeek
        ? { ...d, breaks: [...d.breaks, { startTime: '12:00', endTime: '13:00' }] }
        : d,
    );
    this.scheduleChange.emit(updated);
  }

  removeBreak(dayOfWeek: number, index: number): void {
    const updated = this.schedule().map((d) => {
      if (d.dayOfWeek !== dayOfWeek) return d;
      return { ...d, breaks: d.breaks.filter((_, i) => i !== index) };
    });
    this.scheduleChange.emit(updated);
  }
}
