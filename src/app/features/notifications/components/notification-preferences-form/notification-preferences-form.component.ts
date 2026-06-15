import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationPreferences, UpdateNotificationPreferencesRequest } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notification-preferences-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notification-preferences-form.component.html',
  styleUrl: './notification-preferences-form.component.scss',
})
export class NotificationPreferencesFormComponent {
  readonly preferences = input<NotificationPreferences | null>(null);
  readonly saving = input(false);

  readonly save = output<UpdateNotificationPreferencesRequest>();

  readonly emailEnabled = signal(true);
  readonly smsEnabled = signal(true);
  readonly pushEnabled = signal(true);
  readonly inAppEnabled = signal(true);
  readonly appointmentReminders = signal(true);
  readonly prescriptionAlerts = signal(true);

  constructor() {
    effect(() => {
      const p = this.preferences();
      if (!p) return;
      this.emailEnabled.set(p.emailEnabled);
      this.smsEnabled.set(p.smsEnabled);
      this.pushEnabled.set(p.pushEnabled);
      this.inAppEnabled.set(p.inAppEnabled);
      this.appointmentReminders.set(p.appointmentReminders);
      this.prescriptionAlerts.set(p.prescriptionAlerts);
    });
  }

  submit(): void {
    this.save.emit({
      emailEnabled: this.emailEnabled(),
      smsEnabled: this.smsEnabled(),
      pushEnabled: this.pushEnabled(),
      inAppEnabled: this.inAppEnabled(),
      appointmentReminders: this.appointmentReminders(),
      prescriptionAlerts: this.prescriptionAlerts(),
    });
  }
}
