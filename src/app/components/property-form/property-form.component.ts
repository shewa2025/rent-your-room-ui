import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { NotificationService } from '../../services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

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
    MatButtonModule
  ],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {
  propertyForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

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
    if (this.propertyForm.valid && this.selectedFile) {
      const formData = new FormData();
      Object.keys(this.propertyForm.value).forEach(key => {
        formData.append(key, this.propertyForm.value[key]);
      });
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.propertyService.createProperty(formData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Property submitted for approval!');
          this.router.navigate(['/my-properties']);
        },
        error: () => {
          // The error is already handled and notified by the service/interceptor
          // but we can add component-specific logic here if needed.
          console.error('Failed to create property');
        }
      });
    } else {
      this.notificationService.showError('Please fill out the form completely and select an image.');
    }
  }
}