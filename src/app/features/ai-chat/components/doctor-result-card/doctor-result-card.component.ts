import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChatDoctor } from '../../models/chat.models';
import { resolveAssetUrl } from '../../../../core/utils/asset-url.util';

@Component({
  selector: 'app-doctor-result-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './doctor-result-card.component.html',
  styleUrl: './doctor-result-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorResultCardComponent {
  readonly doctor = input.required<ChatDoctor>();
  readonly interactive = input(true);

  /** Sends a follow-up message into the chat. */
  readonly ask = output<string>();
  readonly navigated = output<void>();

  protected readonly imageUrl = computed(() => {
    const url = this.doctor().profileImageUrl;
    return url ? resolveAssetUrl(url) : '';
  });

  protected readonly initials = computed(() =>
    this.doctor()
      .name.replace(/^Dr\.?\s*/i, '')
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join(''),
  );

  protected checkSlots(): void {
    const { name, id } = this.doctor();
    this.ask.emit(`Show available time slots for ${name} (doctor id ${id}) tomorrow.`);
  }

  protected book(): void {
    const { name, id } = this.doctor();
    this.ask.emit(`I'd like to book an appointment with ${name} (doctor id ${id}).`);
  }
}
