import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() roomId!: string;
  @Output() reviewSubmitted = new EventEmitter<void>();
  reviewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private notificationService: NotificationService
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, Validators.required],
      comment: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const review = {
        roomId: this.roomId,
        ...this.reviewForm.value
      };
      this.reviewService.addReview(review).subscribe({
        next: () => {
          this.notificationService.showSuccess('Review submitted successfully!');
          this.reviewSubmitted.emit();
          this.reviewForm.reset({ rating: 5 });
        },
        error: (err) => {
          this.notificationService.showError('Failed to submit review.');
          console.error(err);
        }
      });
    }
  }
}