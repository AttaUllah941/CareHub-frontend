import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentResultCardComponent } from '../appointment-result-card/appointment-result-card.component';
import { ConfirmationCardComponent } from '../confirmation-card/confirmation-card.component';
import { DoctorResultCardComponent } from '../doctor-result-card/doctor-result-card.component';
import { ChatAction } from '../../models/chat.models';

type Payload<T extends ChatAction['type']> = Extract<ChatAction, { type: T }>['data'];

/**
 * Renders one structured result from the assistant. Each action type has a dedicated, compact
 * card; user intents (view, book, order…) flow back to the chat through `ask`.
 */
@Component({
  selector: 'app-tool-result',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    DoctorResultCardComponent,
    AppointmentResultCardComponent,
    ConfirmationCardComponent,
  ],
  templateUrl: './tool-result.component.html',
  styleUrl: './tool-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolResultComponent {
  readonly action = input.required<ChatAction>();
  /** False for older messages: result cards stay visible but their buttons are hidden. */
  readonly interactive = input(true);

  readonly ask = output<string>();
  readonly navigated = output<void>();

  private payload<T extends ChatAction['type']>(): Payload<T> {
    return this.action().data as Payload<T>;
  }

  // Typed views of the payload — each is only read inside its matching @case.
  protected readonly doctors = computed(() => this.payload<'DOCTOR_RESULTS'>().doctors);
  protected readonly availability = computed(() => this.payload<'AVAILABILITY'>());
  protected readonly appointments = computed(() => this.payload<'APPOINTMENTS'>());
  protected readonly labs = computed(() => this.payload<'LAB_RESULTS'>().labs);
  protected readonly labTests = computed(() => this.payload<'LAB_TESTS'>());
  protected readonly comparison = computed(() => this.payload<'LAB_PRICE_COMPARISON'>());
  protected readonly medicines = computed(() => this.payload<'MEDICINE_RESULTS'>().medicines);
  protected readonly pharmacies = computed(() => this.payload<'PHARMACY_RESULTS'>().pharmacies);
  protected readonly procedures = computed(() => this.payload<'SURGERY_RESULTS'>().procedures);
  protected readonly hospitals = computed(() => this.payload<'HOSPITAL_RESULTS'>().hospitals);
  protected readonly requests = computed(() => this.payload<'CONSULTATION_REQUESTS'>().requests);
  protected readonly healthItems = computed(() => this.payload<'HEALTH_ANSWERS'>().items);
  protected readonly knowledge = computed(() => this.payload<'KNOWLEDGE'>().passages);
  protected readonly showMedicalNote = computed(() =>
    this.payload<'KNOWLEDGE'>().passages.some((passage) => passage.kind !== 'policy'),
  );

  protected readonly kindLabel: Record<string, string> = {
    article: 'Health article',
    policy: 'CareHub help',
    doctor_answer: 'Doctor answer',
  };
  protected readonly confirmation = computed(() => this.payload<'CONFIRMATION'>());
  protected readonly result = computed(() => this.payload<'ACTION_RESULT'>());
  protected readonly statsBlock = computed(() => this.payload<'STATS'>());
  protected readonly tableBlock = computed(() => this.payload<'TABLE'>());
  protected readonly listBlock = computed(() => this.payload<'LIST'>());

  protected readonly badgeClass: Record<string, string> = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral',
  };

  protected readonly cheapestPrice = computed(() => {
    const rows = this.payload<'LAB_PRICE_COMPARISON'>().rows;
    return rows.length ? Math.min(...rows.map((row) => row.price)) : 0;
  });

  protected send(text: string): void {
    this.ask.emit(text);
  }

  protected bookSlot(time: string): void {
    const { doctorName, doctorId, date } = this.availability();
    this.ask.emit(`Book ${doctorName} (doctor id ${doctorId}) on ${date} at ${time}.`);
  }
}
