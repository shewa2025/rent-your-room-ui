
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

interface JwtResponse {
  token: string;
  refreshToken: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  get isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  login(credentials: {username: string, password: string}): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(response => {
        console.log('Backend login response:', response);
        this.handleAuthentication(response);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/signout`, {}).subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('roles');
      this._isLoggedIn$.next(false);
      this.router.navigate(['/login']);
    });
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refreshtoken`, { refreshToken }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUserRole(): 'USER' | 'ADMIN' | null {
    const roles = localStorage.getItem('roles');
    if (roles) {
      const parsedRoles = JSON.parse(roles);
      if (parsedRoles.includes('ROLE_ADMIN')) {
        return 'ADMIN';
      } else if (parsedRoles.includes('ROLE_USER')) {
        return 'USER';
      }
    }
    return null;
  }

  private handleAuthentication(response: JwtResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('roles', JSON.stringify(response.roles));
    this._isLoggedIn$.next(true);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        const expiry = payload.exp * 1000;
        return (Date.now() > expiry);
      }
      return false;
    } catch (e) {
      return true;
    }
  }
}