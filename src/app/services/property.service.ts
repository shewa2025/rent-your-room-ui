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
        if (error.status === 413 || (error.error && typeof error.error === 'string' && error.error.includes('Maximum upload size exceeded'))) {
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
    return this.http.get<{data: Property[], total: number}>(this.apiUrl, { params });
  }

  getUserProperties(page: number, limit: number): Observable<{data: Property[], total: number}> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<{data: Property[], total: number}>(`${this.apiUrl}/my-properties`, { params });
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  getPendingProperties(page: number, limit: number, searchTerm: string = ''): Observable<{data: Property[], total: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<{data: Property[], total: number}>(`${this.adminUrl}/pending`, { params });
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
    return this.http.get<{data: Property[], total: number}>(this.adminUrl, { params });
  }

  approveProperty(id: string): Observable<any> {
    return this.http.put(`${this.adminUrl}/${id}/approve`, {});
  }

  rejectProperty(id: string): Observable<any> {
    return this.http.put(`${this.adminUrl}/${id}/reject`, {});
  }
}