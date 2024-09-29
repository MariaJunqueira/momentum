import { Routes } from '@angular/router';

import { MessagesComponent } from './pages/messages/messages.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AuthGuard } from './services/auth/auth.guard';
import { SigninGuard } from './services/auth/signin.guard';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [SigninGuard] },
  { path: 'signin', component: SigninComponent, canActivate: [SigninGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/messages', pathMatch: 'full' }, // Redirect to signin by default
  { path: '**', redirectTo: '/signin' } // Wildcard route for a 404 page
];
