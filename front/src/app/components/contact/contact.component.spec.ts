import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ContactComponent } from './contact.component';
import { ContactService } from '../../services/contact.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;
  let element: HTMLElement;

  beforeEach(async () => {
    contactServiceSpy = jasmine.createSpyObj('ContactService', ['sendContactRequest']);

    await TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
  });

  it('should have email field with required validator', () => {
    const emailControl = component.contactForm.get('email');
    expect(emailControl?.hasError('required')).toBeFalsy();

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should have email field with email validator', () => {
    const emailControl = component.contactForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should have message field with required validator', () => {
    const messageControl = component.contactForm.get('message');
    expect(messageControl?.hasError('required')).toBeFalsy();

    messageControl?.setValue('');
    expect(messageControl?.hasError('required')).toBeTruthy();
  });

  it('should have message field with maxLength validator', () => {
    const messageControl = component.contactForm.get('message');

    messageControl?.setValue('a'.repeat(301)); // 301 characters
    expect(messageControl?.hasError('maxlength')).toBeTruthy();

    messageControl?.setValue('a'.repeat(300)); // 300 characters
    expect(messageControl?.hasError('maxlength')).toBeFalsy();
  });

  it('should show character counter', () => {
    const messageControl = component.contactForm.get('message');
    const counterElement = element.querySelector('.form-text');

    messageControl?.setValue('test message');
    fixture.detectChanges();

    expect(counterElement?.textContent).toContain('12/300 caractères');
  });

  it('should not submit if form is invalid', () => {
    spyOn(component, 'onSubmit');

    const submitButton = element.querySelector('button[type="submit"]');
    submitButton?.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should show validation errors when submitted with invalid form', () => {
    component.contactForm.get('email')?.setValue('');
    component.contactForm.get('message')?.setValue('');
    component.submitted = true;
    fixture.detectChanges();

    const emailError = element.querySelector('#email + .invalid-feedback');
    const messageError = element.querySelector('#message + .invalid-feedback');

    expect(emailError?.textContent).toContain('L\'email est obligatoire');
    expect(messageError?.textContent).toContain('Le message est obligatoire');
  });

  it('should send contact request when form is valid', () => {
    const contactRequest = {
      email: 'test@example.com',
      message: 'Test message'
    };

    component.contactForm.setValue(contactRequest);
    contactServiceSpy.sendContactRequest.and.returnValue(of({}));

    component.onSubmit();

    expect(contactServiceSpy.sendContactRequest).toHaveBeenCalledWith(contactRequest);
  });

  it('should show success message after successful submission', () => {
    const contactRequest = {
      email: 'test@example.com',
      message: 'Test message'
    };

    component.contactForm.setValue(contactRequest);
    contactServiceSpy.sendContactRequest.and.returnValue(of({}));

    component.onSubmit();
    fixture.detectChanges();

    const successAlert = element.querySelector('.alert-success');
    expect(successAlert?.textContent).toContain('Demande de contact envoyée avec succès');
    expect(component.success).toBe(true);
  });

  it('should reset form after successful submission', () => {
    const contactRequest = {
      email: 'test@example.com',
      message: 'Test message'
    };

    component.contactForm.setValue(contactRequest);
    contactServiceSpy.sendContactRequest.and.returnValue(of({}));

    component.onSubmit();
    fixture.detectChanges();

    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
    expect(component.submitted).toBe(false);
  });

  it('should show alert on submission error', () => {
    spyOn(window, 'alert');

    component.contactForm.setValue({
      email: 'test@example.com',
      message: 'Test message'
    });
    contactServiceSpy.sendContactRequest.and.returnValue(throwError('Server error'));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');
  });
});
