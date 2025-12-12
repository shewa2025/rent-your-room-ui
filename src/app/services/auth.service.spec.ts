import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const dummyResponse = { token: 'dummy-token' };
    service.login({ email: 'test@test.com', password: 'password' }).subscribe(res => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    expect(localStorage.getItem('token')).toBe('dummy-token');
  });

  it('should logout and remove token', () => {
    localStorage.setItem('token', 'dummy-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should get user role from token', () => {
    // A simple base64 encoded JWT payload for { "role": "ADMIN" }
    const token = 'header.' + btoa(JSON.stringify({ role: 'ADMIN' })) + '.signature';
    localStorage.setItem('token', token);
    expect(service.getUserRole()).toBe('ADMIN');
  });
});