import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { ReviewTableComponent } from '../../components/review-table/review-table.component';
import { ReviewDetailComponent } from '../../components/review-detail/review-detail.component';
import { ReviewModerationFormComponent } from '../../components/review-moderation-form/review-moderation-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Review, REVIEW_STATUS_OPTIONS, ReviewStatus } from '../../../../core/models/review.model';

@Component({
  selector: 'app-admin-review-list-page',
  standalone: true,
  imports: [
    FormsModule,
    ReviewTableComponent,
    ReviewDetailComponent,
    ReviewModerationFormComponent,
    AlertComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-review-list-page.component.html',
  styleUrl: './admin-review-list-page.component.scss',
})
export class AdminReviewListPageComponent implements OnInit {
  protected readonly reviewService = inject(ReviewService);
  readonly search = signal('');
  readonly statusFilter = signal('');
  readonly ratingFilter = signal('');
  readonly viewing = signal<Review | null>(null);
  readonly moderating = signal<Review | null>(null);
  readonly statusOptions = REVIEW_STATUS_OPTIONS;

  constructor() {
    effect(() => {
      if (this.reviewService.successMessage()) {
        this.moderating.set(null);
        this.reviewService.loadReviews();
      }
    });
  }

  ngOnInit(): void {
    this.reviewService.clearError();
    this.reviewService.clearSuccessMessage();
    this.reviewService.loadReviews();
  }

  onSearch(): void {
    this.reviewService.loadReviews({
      search: this.search(),
      status: this.statusFilter(),
      rating: this.ratingFilter(),
      page: 1,
    });
  }

  onPageChange(page: number): void {
    this.reviewService.loadReviews({ page });
  }

  onView(r: Review): void {
    this.viewing.set(r);
    this.moderating.set(null);
  }

  onModerate(r: Review): void {
    this.moderating.set(r);
    this.viewing.set(null);
  }

  onSubmitModeration(payload: { status: ReviewStatus; moderationNote?: string }): void {
    const r = this.moderating();
    if (!r) return;
    this.reviewService.moderateReview(r.id, payload);
  }

  onDelete(r: Review): void {
    if (confirm('Remove this review permanently?')) {
      this.reviewService.deleteReview(r.id);
      if (this.viewing()?.id === r.id) this.viewing.set(null);
      if (this.moderating()?.id === r.id) this.moderating.set(null);
    }
  }

  closeDetail(): void {
    this.viewing.set(null);
    this.moderating.set(null);
  }
}
