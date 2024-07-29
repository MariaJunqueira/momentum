import { Routes } from '@angular/router';

import { MessagesComponent } from './pages/messages/messages.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AuthGuard } from './services/auth/auth.guard';
import { LoginGuard } from './services/auth/login.guard';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/messages', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/login' } // Wildcard route for a 404 page
];
