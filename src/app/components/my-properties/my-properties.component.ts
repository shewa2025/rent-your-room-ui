import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatChipsModule
  ],
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  totalProperties = 0;
  pageSize = 5;
  currentPage = 0;

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getUserProperties(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.properties = response.data || [];
        this.totalProperties = response.total;
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProperties();
  }

  getStatusColor(status: 'PENDING' | 'APPROVED' | 'REJECTED'): string {
    switch (status) {
      case 'PENDING':
        return 'accent';
      case 'APPROVED':
        return 'primary';
      case 'REJECTED':
        return 'warn';
    }
  }
}