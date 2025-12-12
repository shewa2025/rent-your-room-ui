import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  login(credentials: {username: string, password: string}): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(response => {
        console.log('Login successful, token received:', response.token);
        localStorage.setItem('token', response.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): 'USER' | 'ADMIN' | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      console.error('Error decoding JWT', e);
      return null;
    }
  }
}