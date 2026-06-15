import { Component, input, output, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { REVIEW_STATUS_OPTIONS, ReviewStatus } from '../../../../core/models/review.model';

@Component({
  selector: 'app-review-moderation-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './review-moderation-form.component.html',
  styleUrl: './review-moderation-form.component.scss',
})
export class ReviewModerationFormComponent implements OnInit {
  readonly saving = input(false);
  readonly initialStatus = input<ReviewStatus>('PUBLISHED');
  readonly initialNote = input('');

  readonly submit = output<{ status: ReviewStatus; moderationNote?: string }>();

  readonly statusOptions = REVIEW_STATUS_OPTIONS;
  readonly status = signal<ReviewStatus>('PUBLISHED');
  readonly moderationNote = signal('');

  ngOnInit(): void {
    this.status.set(this.initialStatus());
    this.moderationNote.set(this.initialNote());
  }

  onSubmit(): void {
    this.submit.emit({
      status: this.status(),
      moderationNote: this.moderationNote().trim() || undefined,
    });
  }
}
