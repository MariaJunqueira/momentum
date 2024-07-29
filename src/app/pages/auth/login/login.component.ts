import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class LoginComponent {
  public username: string = '';
  public password: string = '';
  public errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Store the token or handle successful login
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/messages']); // Redirect to home or another page
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials, please try again.';
      }
    });
  }
}
