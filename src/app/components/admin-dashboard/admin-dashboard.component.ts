import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
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
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  totalProperties = 0;
  pageSize = 5;
  currentPage = 0;
  searchControl = new FormControl('');
  statusControl = new FormControl('');
  statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private propertyService: PropertyService,
    private notificationService: NotificationService
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
    this.statusControl.valueChanges.pipe(
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
    const status = this.statusControl.value === 'ALL' ? '' : this.statusControl.value || '';
    this.propertyService.getAllProperties(this.currentPage, this.pageSize, searchTerm, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.properties = response.data;
          this.totalProperties = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading properties:', error);
          this.notificationService.showError('Error loading properties.');
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProperties();
  }

  approve(propertyId: string): void {
    this.propertyService.approveProperty(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Property approved!');
          this.loadProperties();
        },
        error: (error) => {
          console.error('Error approving property:', error);
          this.notificationService.showError('Error approving property.');
        }
      });
  }

  reject(propertyId: string): void {
    this.propertyService.rejectProperty(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Property rejected.');
          this.loadProperties();
        },
        error: (error) => {
          console.error('Error rejecting property:', error);
          this.notificationService.showError('Error rejecting property.');
        }
      });
  }
}