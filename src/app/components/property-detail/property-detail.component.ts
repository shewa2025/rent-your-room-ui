
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReviewFormComponent
  ],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  property: Property | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private notificationService: NotificationService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadProperty();
  }

  loadProperty(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.isLoading = true;
      this.propertyService.getPropertyById(propertyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (property) => {
            this.property = property;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading property:', error);
            this.notificationService.showError('Error loading property.');
            this.isLoading = false;
          }
        });
    }
  }

  reloadProperty(): void {
    this.loadProperty();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}