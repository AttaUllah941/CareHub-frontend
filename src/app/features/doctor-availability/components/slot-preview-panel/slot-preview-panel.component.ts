import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { AvailabilitySlot } from '../../../../core/models/doctor-availability.model';

@Component({
  selector: 'app-slot-preview-panel',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './slot-preview-panel.component.html',
  styleUrl: './slot-preview-panel.component.scss',
})
export class SlotPreviewPanelComponent {
  readonly date = input.required<string>();
  readonly slots = input<AvailabilitySlot[]>([]);
  readonly slotDurationMinutes = input(30);
  readonly loading = input(false);

  readonly dateChange = output<string>();
  readonly preview = output<string>();

  onDateChange(value: string): void {
    this.dateChange.emit(value);
    this.preview.emit(value);
  }
}
