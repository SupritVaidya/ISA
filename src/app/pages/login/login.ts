import { Component,inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private userService = inject(UserService);
  private router = inject(Router);


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  

  onSubmit() {
  if (this.loginForm.valid) {
    this.userService.login(this.email?.value || '', this.password?.value || '').subscribe({
      next: (user) => {
        this.userService.currentUser.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/home']);
        alert(`Welcome back, ${user.firstName}!`);
      },

      error: () => {
        alert('Invalid email or password.');
      }
    });

  }
}
}



