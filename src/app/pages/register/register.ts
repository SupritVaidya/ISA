import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private userService = inject(UserService);

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    studentId: new FormControl(''),
    passwordHash: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get studentId() {
    return this.registerForm.get('studentId');
  }
  get passwordHash() {
    return this.registerForm.get('passwordHash');
  }
  

  onSubmit() {
  if (this.registerForm.valid) {
    this.userService.getUserByEmail(this.email?.value || '').subscribe({
      next: () => alert('This email is already in use. Please choose a different one.'),
      error: () => {
        this.userService.registerUser(this.registerForm.value as any).subscribe({
          next: () => alert('Account created successfully! You can now log in.'),
          error: (err) => console.error('Registration failed', err)
        });
      }
    });
  }
}



}
