import { Component, input, output } from '@angular/core';
import {
  Review,
  formatReviewDate,
  reviewStatusClass,
  reviewStatusLabel,
  starLabel,
} from '../../../../core/models/review.model';

@Component({
  selector: 'app-review-table',
  standalone: true,
  templateUrl: './review-table.component.html',
  styleUrl: './review-table.component.scss',
})
export class ReviewTableComponent {
  readonly reviews = input<Review[]>([]);
  readonly loading = input(false);
  readonly showPatient = input(false);
  readonly showDoctor = input(true);
  readonly showStatus = input(false);
  readonly showActions = input(true);
  readonly allowEdit = input(false);
  readonly adminMode = input(false);

  readonly viewReview = output<Review>();
  readonly editReview = output<Review>();
  readonly moderateReview = output<Review>();
  readonly deleteReview = output<Review>();

  readonly formatDate = formatReviewDate;
  readonly statusLabel = reviewStatusLabel;
  readonly statusClass = reviewStatusClass;
  readonly stars = starLabel;

  colspan(): number {
    let cols = 4;
    if (this.showPatient()) cols++;
    if (this.showDoctor()) cols++;
    if (this.showStatus()) cols++;
    if (this.showActions()) cols++;
    return cols;
  }
}
