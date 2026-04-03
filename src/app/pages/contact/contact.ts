import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

  contactForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    message: new FormControl('')
  });

  onSubmit() {
    console.log(this.contactForm.value);
    alert('Thank you for contacting us! We will get back to you soon.');
    this.contactForm.reset();
  }
  

}
