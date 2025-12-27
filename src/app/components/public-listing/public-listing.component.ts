import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-public-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './public-listing.component.html',
  styleUrls: ['./public-listing.component.css']
})
export class PublicListingComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  totalProperties = 0;
  pageSize = 10;
  currentPage = 0;
  searchControl = new FormControl('');
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProperties();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadProperties();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProperties(): void {
    this.isLoading = true;
    const searchTerm = this.searchControl.value || '';
    this.propertyService.getPublicProperties(this.currentPage, this.pageSize, searchTerm)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            if (!this.authService.isLoggedIn) {
              this.notificationService.showError('You need to log in to view properties.');
              this.router.navigate(['/login']);
            }
          }
          this.isLoading = false;
          return of({ data: [], total: 0 }); // Return an empty observable to prevent the app from crashing
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: any) => {
        this.properties = response.data || response;
        this.totalProperties = response.total || (response ? response.length : 0);
        this.isLoading = false;
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProperties();
  }
}