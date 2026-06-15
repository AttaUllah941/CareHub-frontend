import { Component, inject, OnInit, signal } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ReviewTableComponent } from '../../components/review-table/review-table.component';
import { ReviewDetailComponent } from '../../components/review-detail/review-detail.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Review, starLabel } from '../../../../core/models/review.model';

@Component({
  selector: 'app-doctor-review-list-page',
  standalone: true,
  imports: [ReviewTableComponent, ReviewDetailComponent, AlertComponent],
  templateUrl: './doctor-review-list-page.component.html',
  styleUrl: './doctor-review-list-page.component.scss',
})
export class DoctorReviewListPageComponent implements OnInit {
  protected readonly reviewService = inject(ReviewService);
  readonly selected = signal<Review | null>(null);
  readonly stars = starLabel;
  protected readonly Math = Math;

  ngOnInit(): void {
    this.reviewService.clearError();
    this.reviewService.loadDoctorReviews();
  }

  averageRating(): number {
    const reviews = this.reviewService.doctorReviews().filter((r) => r.status === 'PUBLISHED');
    if (!reviews.length) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  }

  onView(r: Review): void {
    this.selected.set(r);
  }

  closeDetail(): void {
    this.selected.set(null);
  }
}
