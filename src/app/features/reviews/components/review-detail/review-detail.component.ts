import { Component, input } from '@angular/core';
import {
  Review,
  formatReviewDate,
  reviewStatusClass,
  reviewStatusLabel,
  starLabel,
} from '../../../../core/models/review.model';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.scss',
})
export class ReviewDetailComponent {
  readonly review = input.required<Review>();
  readonly showModeration = input(false);

  readonly formatDate = formatReviewDate;
  readonly statusLabel = reviewStatusLabel;
  readonly statusClass = reviewStatusClass;
  readonly stars = starLabel;
}
