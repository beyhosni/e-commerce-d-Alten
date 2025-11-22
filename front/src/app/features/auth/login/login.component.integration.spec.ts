import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';

describe('LoginComponent Integration Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let location: Location;
  let emailInput: DebugElement;
  let passwordInput: DebugElement;
  let submitButton: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        ButtonModule,
        InputTextModule,
        MessagesModule,
        MessageModule,
        CardModule
      ],
      declarations: [LoginComponent],
      providers: [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    location = TestBed.inject(Location);

    fixture.detectChanges();

    emailInput = fixture.debugElement.query(By.css('#email'));
    passwordInput = fixture.debugElement.query(By.css('#password'));
    submitButton = fixture.debugElement.query(By.css('p-button'));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form', () => {
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should bind email input to loginData.email', () => {
    const testEmail = 'test@example.com';
    emailInput.nativeElement.value = testEmail;
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.loginData.email).toBe(testEmail);
  });

  it('should bind password input to loginData.password', () => {
    const testPassword = 'password123';
    passwordInput.nativeElement.value = testPassword;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.loginData.password).toBe(testPassword);
  });

  it('should display error message when login fails', () => {
    const errorMessage = 'Email ou mot de passe incorrect.';
    spyOn(authService, 'login').and.returnValue(throwError({ error: { message: errorMessage } }));
    spyOn(window, 'alert');

    component.loginData.email = 'wrong@example.com';
    component.loginData.password = 'wrongpassword';

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to home when login succeeds', () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      type: 'Bearer',
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      firstname: 'Test'
    };

    spyOn(authService, 'login').and.returnValue(Promise.resolve(mockResponse));
    spyOn(location, 'path').and.returnValue('/home');

    component.loginData.email = 'test@example.com';
    component.loginData.password = 'password123';

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(location.path()).toBe('/home');
  });

  it('should disable submit button when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBe(true);
  });

  it('should enable submit button when not loading', () => {
    component.isLoading = false;
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBe(false);
  });

  it('should have a link to register page', () => {
    const registerLink = fixture.debugElement.query(By.css('a[routerLink="/register"]'));
    expect(registerLink).toBeTruthy();
  });
});
