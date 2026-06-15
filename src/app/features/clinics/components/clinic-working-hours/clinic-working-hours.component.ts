import { Component, computed, input, output } from '@angular/core';
import { DaySchedule } from '../../../../core/models/doctor-availability.model';
import {
  ClinicWorkingDay,
  scheduleToWorkingHours,
  workingHoursToSchedule,
} from '../../../../core/models/clinic.model';
import { WeeklyScheduleCalendarComponent } from '../../../doctor-availability/components/weekly-schedule-calendar/weekly-schedule-calendar.component';

@Component({
  selector: 'app-clinic-working-hours',
  standalone: true,
  imports: [WeeklyScheduleCalendarComponent],
  templateUrl: './clinic-working-hours.component.html',
  styleUrl: './clinic-working-hours.component.scss',
})
export class ClinicWorkingHoursComponent {
  readonly workingHours = input.required<ClinicWorkingDay[]>();
  readonly workingHoursChange = output<ClinicWorkingDay[]>();

  readonly schedule = computed(() => workingHoursToSchedule(this.workingHours()));

  onScheduleChange(schedule: DaySchedule[]): void {
    this.workingHoursChange.emit(scheduleToWorkingHours(schedule));
  }
}
