import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService, ContactRequest } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    const contactRequest: ContactRequest = {
      email: this.contactForm.value.email,
      message: this.contactForm.value.message
    };

    this.contactService.sendContactRequest(contactRequest).subscribe({
      next: () => {
        this.success = true;
        this.contactForm.reset();
        this.submitted = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du formulaire de contact:', error);
        alert('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');
      }
    });
  }
}
