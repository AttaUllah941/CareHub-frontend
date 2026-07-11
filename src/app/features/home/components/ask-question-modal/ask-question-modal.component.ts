import {
  Component,
  effect,
  HostListener,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HEALTH_QUESTION_CATEGORIES, PAKISTAN_CITIES } from '../../data/home-content';
import { HealthQuestionsApiService } from '../../services/health-questions-api.service';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../auth/services/auth.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { setBodyScrollLocked } from '../../../appointments/utils/browser.util';

@Component({
  selector: 'app-ask-question-modal',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './ask-question-modal.component.html',
  styleUrl: './ask-question-modal.component.scss',
})
export class AskQuestionModalComponent {
  private readonly healthQuestionsApi = inject(HealthQuestionsApiService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly open = input(false);
  readonly defaultCity = input('Lahore');

  readonly closed = output<void>();
  readonly submitted = output<void>();

  protected readonly categories = HEALTH_QUESTION_CATEGORIES;
  protected readonly cities = PAKISTAN_CITIES;

  readonly submitting = signal(false);
  readonly showValidation = signal(false);

  readonly questionText = signal('');
  readonly category = signal<string>(HEALTH_QUESTION_CATEGORIES[0]);
  readonly city = signal('Lahore');
  readonly isAnonymous = signal(true);
  readonly askerName = signal('');
  readonly age = signal<number | null>(null);
  readonly gender = signal<'' | 'male' | 'female' | 'other'>('');

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;
      setBodyScrollLocked(this.isBrowser, this.open());
      if (this.open()) {
        this.resetForm();
        this.city.set(this.defaultCity());
        this.prefillFromUser();
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open() && !this.submitting()) {
      this.close();
    }
  }

  private prefillFromUser(): void {
    const user = this.auth.user();
    if (!user) return;
    this.askerName.set(`${user.firstName} ${user.lastName}`.trim());
    this.isAnonymous.set(false);
  }

  private resetForm(): void {
    this.questionText.set('');
    this.category.set(HEALTH_QUESTION_CATEGORIES[0]);
    this.isAnonymous.set(true);
    this.askerName.set('');
    this.age.set(null);
    this.gender.set('');
    this.showValidation.set(false);
  }

  close(): void {
    if (this.submitting()) return;
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.dataset['backdrop'] === 'true') {
      this.close();
    }
  }

  questionValid(): boolean {
    return this.questionText().trim().length >= 10;
  }

  nameValid(): boolean {
    return this.isAnonymous() || this.askerName().trim().length >= 2;
  }

  canSubmit(): boolean {
    return this.questionValid() && this.nameValid() && !this.submitting();
  }

  submit(): void {
    this.showValidation.set(true);
    if (!this.canSubmit()) return;

    this.submitting.set(true);

    this.healthQuestionsApi
      .submit({
        question: this.questionText().trim(),
        category: this.category(),
        city: this.city(),
        isAnonymous: this.isAnonymous(),
        askerName: this.isAnonymous() ? undefined : this.askerName().trim(),
        age: this.age(),
        gender: this.gender() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.notifications.showSuccess(
            res.message || 'Your question has been submitted. A doctor will respond within 24 hours.',
          );
          this.submitted.emit();
          this.close();
        },
        error: (err) => {
          this.submitting.set(false);
          this.notifications.showError(this.apiErrorService.getMessage(err));
        },
      });
  }
}
