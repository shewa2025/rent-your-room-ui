import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) { }

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.propertyService.getPropertyById(propertyId).subscribe(property => {
        this.property = property;
        this.isLoading = false;
      });
    }
  }
}