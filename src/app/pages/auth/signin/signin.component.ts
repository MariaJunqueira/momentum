import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class SigninComponent {
  public username: string = '';
  public password: string = '';
  public errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  signin(): void {
    this.authService.signin(this.username, this.password).subscribe({
      next: (response) => {
        // Store the token or handle successful signin
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/messages']); // Redirect to home or another page
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials, please try again.';
      }
    });
  }
}
