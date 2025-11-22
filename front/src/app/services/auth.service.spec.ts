import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthRequest, RegisterRequest, AuthResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageSpy = spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') {
        return 'fake-jwt-token';
      }
      return null;
    });
    spyOn(localStorage, 'removeItem');
    spyOn(localStorage, 'setItem');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login request and store token on success', () => {
      const mockCredentials: AuthRequest = {
        email: 'test@example.com',
        password: 'password123'
      };
      const mockResponse: AuthResponse = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        firstname: 'Test'
      };

      service.login(mockCredentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', mockResponse.token);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/token');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const mockCredentials: AuthRequest = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      service.login(mockCredentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => expect(error).toBeTruthy()
      });

      const req = httpMock.expectOne('http://localhost:8080/api/token');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should send registration request and store token on success', () => {
      const mockUserData: RegisterRequest = {
        username: 'newuser',
        firstname: 'New',
        email: 'new@example.com',
        password: 'password123'
      };
      const mockResponse: AuthResponse = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 2,
        email: 'new@example.com',
        username: 'newuser',
        firstname: 'New'
      };

      service.register(mockUserData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', mockResponse.token);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/account');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUserData);
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const mockUserData: RegisterRequest = {
        username: 'existinguser',
        firstname: 'Existing',
        email: 'existing@example.com',
        password: 'password123'
      };

      service.register(mockUserData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => expect(error).toBeTruthy()
      });

      const req = httpMock.expectOne('http://localhost:8080/api/account');
      req.flush('Email already exists', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      service.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if valid token exists', () => {
      localStorageSpy.and.returnValue('valid-jwt-token');
      spyOn(service as any, 'isTokenExpired').and.returnValue(false);

      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false if no token exists', () => {
      localStorageSpy.and.returnValue(null);

      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return false if token is expired', () => {
      localStorageSpy.and.returnValue('expired-jwt-token');
      spyOn(service as any, 'isTokenExpired').and.returnValue(true);

      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const expectedToken = 'test-token';
      localStorageSpy.and.returnValue(expectedToken);

      expect(service.getToken()).toBe(expectedToken);
    });

    it('should return null if no token in localStorage', () => {
      localStorageSpy.and.returnValue(null);

      expect(service.getToken()).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true if user email is admin@admin.com', () => {
      const mockDecodedToken = { email: 'admin@admin.com' };
      spyOn(service as any, 'getCurrentUser').and.returnValue(mockDecodedToken);

      expect(service.isAdmin()).toBe(true);
    });

    it('should return false if user email is not admin@admin.com', () => {
      const mockDecodedToken = { email: 'user@example.com' };
      spyOn(service as any, 'getCurrentUser').and.returnValue(mockDecodedToken);

      expect(service.isAdmin()).toBe(false);
    });
  });
});
