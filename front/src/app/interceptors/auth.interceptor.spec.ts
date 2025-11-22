import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthService, useValue: authSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should add authorization header when token exists', () => {
    const testToken = 'test-jwt-token';
    authServiceSpy.getToken.and.returnValue(testToken);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    req.flush({});
  });

  it('should not add authorization header when token does not exist', () => {
    authServiceSpy.getToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should clone request with authorization header', () => {
    const testToken = 'test-jwt-token';
    authServiceSpy.getToken.and.returnValue(testToken);

    const originalRequest = new HttpRequest('GET', '/api/test');
    const originalHeaders = originalRequest.headers.keys();

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');

    // Vérifier que tous les en-têtes originaux sont présents
    originalHeaders.forEach(header => {
      expect(req.request.headers.has(header)).toBe(true);
    });

    // Vérifier que l'en-tête d'autorisation a été ajouté
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    req.flush({});
  });
});
