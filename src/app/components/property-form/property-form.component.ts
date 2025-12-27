import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { NotificationService } from '../../services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit, OnDestroy {
  propertyForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.authService.isLoggedIn) {
      this.notificationService.showError('You must be logged in to create a property.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.propertyForm.valid && this.selectedFile) {
      this.isSubmitting = true;
      const formData = new FormData();
      
      // Backend expects a 'room' part with JSON data and an 'image' part for the file.
      const roomData = this.propertyForm.value;
      formData.append('room', new Blob([JSON.stringify(roomData)], { type: 'application/json' }));
      
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.propertyService.createProperty(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Property submitted for approval!');
            this.router.navigate(['/my-properties']);
            this.isSubmitting = false;
          },
          error: () => {
            // The error is already handled and notified by the service/interceptor
            // but we can add component-specific logic here if needed.
            console.error('Failed to create property');
            this.isSubmitting = false;
          }
        });
    } else {
      this.notificationService.showError('Please fill out the form completely and select an image.');
    }
  }
}