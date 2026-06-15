import { DatePipe } from '@angular/common';
import { Component, input, output, signal, computed } from '@angular/core';
import { VacationDate } from '../../../../core/models/doctor-availability.model';

@Component({
  selector: 'app-vacation-calendar',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './vacation-calendar.component.html',
  styleUrl: './vacation-calendar.component.scss',
})
export class VacationCalendarComponent {
  readonly vacations = input<VacationDate[]>([]);
  readonly vacationsChange = output<VacationDate[]>();

  readonly currentMonth = signal(new Date());

  readonly monthLabel = computed(() =>
    this.currentMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  );

  readonly calendarDays = computed(() => {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();

    const days: { date: Date | null; onVacation: boolean }[] = [];
    for (let i = 0; i < startOffset; i += 1) days.push({ date: null, onVacation: false });
    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(year, m, d);
      days.push({ date, onVacation: this.isVacationDay(date) });
    }
    return days;
  });

  prevMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  isVacationDay(date: Date): boolean {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return this.vacations().some((v) => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return target >= start && target <= end;
    });
  }

  addVacation(): void {
    const start = prompt('Vacation start date (YYYY-MM-DD)');
    if (!start) return;
    const end = prompt('Vacation end date (YYYY-MM-DD)', start);
    if (!end) return;
    const reason = prompt('Reason (optional)') ?? '';
    this.vacationsChange.emit([
      ...this.vacations(),
      { startDate: start, endDate: end, reason },
    ]);
  }

  removeVacation(index: number): void {
    this.vacationsChange.emit(this.vacations().filter((_, i) => i !== index));
  }
}
