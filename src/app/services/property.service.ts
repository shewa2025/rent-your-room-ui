import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Property } from '../models/property.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = '/api/rooms';
  private adminUrl = '/api/admin/rooms';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  createProperty(formData: FormData): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notificationService.showError('Authentication failed. Please log in again.');
          this.authService.logout();
        } else if (error.status === 413 || (error.error && typeof error.error === 'string' && error.error.includes('Maximum upload size exceeded'))) {
          this.notificationService.showError('The selected image is too large. Please choose a smaller file. The maximum file size is 1MB.');
        } else {
          this.notificationService.showError('An error occurred while creating the property.');
        }
        return throwError(() => error);
      })
    );
  }

  getProperties(page: number, limit: number, searchTerm: string = ''): Observable<{data: Property[], total: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<{data: Property[], total: number}>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError('An error occurred while fetching properties.');
        return throwError(() => error);
      })
    );
  }

  getUserProperties(page: number, limit: number): Observable<{data: Property[], total: number}> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<{data: Property[], total: number}>(`${this.apiUrl}/my-rooms`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError('An error occurred while fetching your properties.');
        return throwError(() => error);
      })
    );
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError('An error occurred while fetching the property details.');
        return throwError(() => error);
      })
    );
  }

  getPendingProperties(page: number, limit: number, searchTerm: string = ''): Observable<{data: Property[], total: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<{data: Property[], total: number}>(`${this.adminUrl}/pending`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError('An error occurred while fetching pending properties.');
        return throwError(() => error);
      })
    );
  }

  getAllProperties(page: number, limit: number, searchTerm: string = '', status: string = ''): Observable<{data: Property[], total: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<{data: Property[], total: number}>(this.adminUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError('An error occurred while fetching all properties.');
        return throwError(() => error);
      })
    );
  }

  approveProperty(id: string): Observable<any> {
    return this.http.put(`${this.adminUrl}/${id}/approve`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError('An error occurred while approving the property.');
        return throwError(() => error);
      })
    );
  }

  rejectProperty(id: string): Observable<any> {
    return this.http.put(`${this.adminUrl}/${id}/reject`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError('An error occurred while rejecting the property.');
        return throwError(() => error);
      })
    );
  }
}