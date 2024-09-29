import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SignupComponent {
  username = '';
  password = '';
  signupForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      this.authService.signUp(username, password).subscribe(
        (response) => {
          console.log('User signed up successfully:', response);
          this.errorMessage = null;
          this.router.navigate(['/signin']);
        },
        (error) => {
          console.error('Signup error:', error);
          this.errorMessage = 'An error occurred during sign-up. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
