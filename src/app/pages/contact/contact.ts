import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact-service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', Validators.required)
  });

  submitting = false;
  submitted = false;
  error = false;

  constructor(private contactService: ContactService) {}

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.submitting = true;
    this.error = false;
    this.submitted = false;

    const { name, email, message } = this.contactForm.value;

    this.contactService.sendMessage(name!, email!, message!).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.contactForm.reset();
      },
      error: () => {
        this.submitting = false;
        this.error = true;
      }
    });
  }

}
