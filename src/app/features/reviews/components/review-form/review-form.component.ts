import { Component, input, output, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateReviewRequest } from '../../../../core/models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss',
})
export class ReviewFormComponent implements OnInit {
  readonly saving = input(false);
  readonly initialRating = input(5);
  readonly initialTitle = input('');
  readonly initialComment = input('');
  readonly submitLabel = input('Submit Review');

  readonly submit = output<CreateReviewRequest>();

  readonly rating = signal(5);
  readonly title = signal('');
  readonly comment = signal('');

  ngOnInit(): void {
    this.rating.set(this.initialRating());
    this.title.set(this.initialTitle());
    this.comment.set(this.initialComment());
  }

  setRating(value: number): void {
    this.rating.set(value);
  }

  onSubmit(): void {
    this.submit.emit({
      rating: this.rating(),
      title: this.title().trim() || undefined,
      comment: this.comment().trim() || undefined,
    });
  }
}
