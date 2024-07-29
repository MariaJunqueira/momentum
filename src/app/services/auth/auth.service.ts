import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user!: {
    username: string;
  };

  constructor(private http: HttpClient) { }

  signUp(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/register', { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/login', { username, password });
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      return !this.isTokenExpired(token);
    }
    return false;
  }

  getUser() {
    return this.user;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      this.user = decodedToken;
      const currentTime = Math.floor(new Date().getTime() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }
}
