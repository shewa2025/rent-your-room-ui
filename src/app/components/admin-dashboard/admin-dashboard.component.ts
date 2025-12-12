import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  properties: Property[] = [];
  totalProperties = 0;
  pageSize = 5;
  currentPage = 0;
  searchControl = new FormControl('');
  statusControl = new FormControl('');
  statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  constructor(
    private propertyService: PropertyService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadProperties();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadProperties();
    });
    this.statusControl.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadProperties();
    });
  }

  loadProperties(): void {
    const searchTerm = this.searchControl.value || '';
    const status = this.statusControl.value === 'ALL' ? '' : this.statusControl.value || '';
    this.propertyService.getAllProperties(this.currentPage, this.pageSize, searchTerm, status)
      .subscribe(response => {
        this.properties = response.data;
        this.totalProperties = response.total;
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProperties();
  }

  approve(propertyId: string): void {
    this.propertyService.approveProperty(propertyId).subscribe(() => {
      this.notificationService.showSuccess('Property approved!');
      this.loadProperties();
    });
  }

  reject(propertyId: string): void {
    this.propertyService.rejectProperty(propertyId).subscribe(() => {
      this.notificationService.showSuccess('Property rejected.');
      this.loadProperties();
    });
  }
}