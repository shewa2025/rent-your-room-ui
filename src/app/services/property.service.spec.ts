import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { Property } from '../models/property.model';
import { User } from '../models/user.model';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;

  const mockUser: User = { id: '1', name: 'Test User', email: 'test@test.com', role: 'USER' };
  const mockProperty: Property = {
    id: '1',
    title: 'Test Property',
    description: 'Test Description',
    price: 100,
    address: 'Test Address',
    imageUrl: 'test.jpg',
    status: 'APPROVED',
    owner: mockUser
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PropertyService]
    });
    service = TestBed.inject(PropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get properties', () => {
    const dummyProperties = { data: [mockProperty], total: 1 };
    service.getProperties(0, 10).subscribe(res => {
      expect(res).toEqual(dummyProperties);
    });

    const req = httpMock.expectOne('/api/rooms?page=0&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProperties);
  });

  it('should get property by id', () => {
    service.getPropertyById('1').subscribe(res => {
      expect(res).toEqual(mockProperty);
    });

    const req = httpMock.expectOne('/api/rooms/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProperty);
  });

  it('should approve a property', () => {
    service.approveProperty('1').subscribe();

    const req = httpMock.expectOne('/api/admin/rooms/1/approve');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});