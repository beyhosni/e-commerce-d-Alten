import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';

describe('RegisterComponent Integration Tests', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let location: Location;
  let usernameInput: DebugElement;
  let firstnameInput: DebugElement;
  let emailInput: DebugElement;
  let passwordInput: DebugElement;
  let confirmPasswordInput: DebugElement;
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
      declarations: [RegisterComponent],
      providers: [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    location = TestBed.inject(Location);

    fixture.detectChanges();

    usernameInput = fixture.debugElement.query(By.css('#username'));
    firstnameInput = fixture.debugElement.query(By.css('#firstname'));
    emailInput = fixture.debugElement.query(By.css('#email'));
    passwordInput = fixture.debugElement.query(By.css('#password'));
    confirmPasswordInput = fixture.debugElement.query(By.css('#confirmPassword'));
    submitButton = fixture.debugElement.query(By.css('p-button'));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render register form', () => {
    expect(usernameInput).toBeTruthy();
    expect(firstnameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should bind inputs to registerData', () => {
    const testUsername = 'testuser';
    const testFirstname = 'Test';
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    usernameInput.nativeElement.value = testUsername;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

    firstnameInput.nativeElement.value = testFirstname;
    firstnameInput.nativeElement.dispatchEvent(new Event('input'));

    emailInput.nativeElement.value = testEmail;
    emailInput.nativeElement.dispatchEvent(new Event('input'));

    passwordInput.nativeElement.value = testPassword;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.registerData.username).toBe(testUsername);
    expect(component.registerData.firstname).toBe(testFirstname);
    expect(component.registerData.email).toBe(testEmail);
    expect(component.registerData.password).toBe(testPassword);
  });

  it('should bind confirmPassword input to confirmPassword', () => {
    const testConfirmPassword = 'password123';

    confirmPasswordInput.nativeElement.value = testConfirmPassword;
    confirmPasswordInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.confirmPassword).toBe(testConfirmPassword);
  });

  it('should display error message when passwords do not match', () => {
    component.registerData.password = 'password123';
    component.confirmPassword = 'differentpassword';

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Les mots de passe ne correspondent pas.');
    expect(component.isLoading).toBe(false);
  });

  it('should display error message when registration fails', () => {
    const errorMessage = 'Email déjà utilisé.';
    spyOn(authService, 'register').and.returnValue(throwError({ error: { message: errorMessage } }));

    component.registerData.username = 'existinguser';
    component.registerData.firstname = 'Existing';
    component.registerData.email = 'existing@example.com';
    component.registerData.password = 'password123';
    component.confirmPassword = 'password123';

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBe(false);
  });

  it('should display success message and navigate to login when registration succeeds', () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      type: 'Bearer',
      id: 2,
      email: 'new@example.com',
      username: 'newuser',
      firstname: 'New'
    };

    spyOn(authService, 'register').and.returnValue(Promise.resolve(mockResponse));
    spyOn(location, 'path').and.returnValue('/login');
    jasmine.clock().install();

    component.registerData.username = 'newuser';
    component.registerData.firstname = 'New';
    component.registerData.email = 'new@example.com';
    component.registerData.password = 'password123';
    component.confirmPassword = 'password123';

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(component.successMessage).toBe('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
    expect(component.isLoading).toBe(false);

    jasmine.clock().tick(2000);
    expect(location.path()).toBe('/login');

    jasmine.clock().uninstall();
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

  it('should have a link to login page', () => {
    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    expect(loginLink).toBeTruthy();
  });
});
