import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        ButtonModule,
        InputTextModule,
        MessagesModule,
        MessageModule,
        CardModule
      ],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty fields', () => {
    expect(component.loginData.email).toBe('');
    expect(component.loginData.password).toBe('');
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should call authService.login when form is submitted', () => {
    const mockResponse = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      firstname: 'Test'
    };

    component.loginData.email = 'test@example.com';
    component.loginData.password = 'password123';

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.isLoading).toBe(true);
  });

  it('should set isLoading to false and navigate to home on successful login', () => {
    const mockResponse = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      firstname: 'Test'
    };

    const routerSpy = spyOn(TestBed.inject(RouterTestingModule), 'navigate');

    component.loginData.email = 'test@example.com';
    component.loginData.password = 'password123';

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should set isLoading to false and display error message on login failure', () => {
    const errorResponse = { error: { message: 'Email ou mot de passe incorrect.' } };

    component.loginData.email = 'test@example.com';
    component.loginData.password = 'wrongpassword';

    authServiceSpy.login.and.returnValue(throwError(errorResponse));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Email ou mot de passe incorrect.');
  });

  it('should set isLoading to false and display default error message when error message is not provided', () => {
    const errorResponse = {};

    component.loginData.email = 'test@example.com';
    component.loginData.password = 'wrongpassword';

    authServiceSpy.login.and.returnValue(throwError(errorResponse));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Email ou mot de passe incorrect.');
  });
});
