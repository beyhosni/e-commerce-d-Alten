import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['register']);

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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form with empty fields', () => {
    expect(component.registerData.username).toBe('');
    expect(component.registerData.firstname).toBe('');
    expect(component.registerData.email).toBe('');
    expect(component.registerData.password).toBe('');
    expect(component.confirmPassword).toBe('');
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  it('should call authService.register when form is submitted with matching passwords', () => {
    const mockResponse = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      email: 'new@example.com',
      username: 'newuser',
      firstname: 'New'
    };

    component.registerData.username = 'newuser';
    component.registerData.firstname = 'New';
    component.registerData.email = 'new@example.com';
    component.registerData.password = 'password123';
    component.confirmPassword = 'password123';

    authServiceSpy.register.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      username: 'newuser',
      firstname: 'New',
      email: 'new@example.com',
      password: 'password123'
    });
    expect(component.isLoading).toBe(true);
  });

  it('should set isLoading to false and display success message on successful registration', () => {
    const mockResponse = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      email: 'new@example.com',
      username: 'newuser',
      firstname: 'New'
    };

    const routerSpy = spyOn(TestBed.inject(RouterTestingModule), 'navigate');
    jasmine.clock().install();

    component.registerData.username = 'newuser';
    component.registerData.firstname = 'New';
    component.registerData.email = 'new@example.com';
    component.registerData.password = 'password123';
    component.confirmPassword = 'password123';

    authServiceSpy.register.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.successMessage).toBe('Compte créé avec succès! Vous pouvez maintenant vous connecter.');

    jasmine.clock().tick(2000);
    expect(routerSpy).toHaveBeenCalledWith(['/login']);

    jasmine.clock().uninstall();
  });

  it('should set isLoading to false and display error message on registration failure', () => {
    const errorResponse = { error: { message: 'Email déjà utilisé.' } };

    component.registerData.username = 'existinguser';
    component.registerData.firstname = 'Existing';
    component.registerData.email = 'existing@example.com';
    component.registerData.password = 'password123';
    component.confirmPassword = 'password123';

    authServiceSpy.register.and.returnValue(throwError(errorResponse));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Email déjà utilisé.');
  });

  it('should set isLoading to false and display default error message when error message is not provided', () => {
    const errorResponse = {};

    component.registerData.username = 'newuser';
    component.registerData.firstname = 'New';
    component.registerData.email = 'new@example.com';
    component.registerData.password = 'password123';
    component.confirmPassword = 'password123';

    authServiceSpy.register.and.returnValue(throwError(errorResponse));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Une erreur est survenue lors de la création du compte.');
  });

  it('should not call authService.register when passwords do not match', () => {
    component.registerData.username = 'newuser';
    component.registerData.firstname = 'New';
    component.registerData.email = 'new@example.com';
    component.registerData.password = 'password123';
    component.confirmPassword = 'differentpassword';

    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Les mots de passe ne correspondent pas.');
  });
});
