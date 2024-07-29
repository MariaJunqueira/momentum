import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, EMPTY } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;  // Definite assignment assertion
  public clientId: string = '';

  constructor(private authService: AuthService) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    const token = this.authService.getToken();
    if (token) {
      this.socket$ = webSocket(`ws://localhost:8080?token=${token}`);

      this.socket$.subscribe(
        (message) => {
          if (message.type === 'system') {
            this.clientId = message.username;
          }
          console.log('Received message:', message);
        },
        (err) => console.error('WebSocket error:', err),
        () => console.log('WebSocket connection closed')
      );
    } else {
      console.error('No authentication token found');
    }
  }

  public sendMessage(to: string, content: string): void {
    if (this.socket$) {
      const message = {
        type: 'message',
        to: to,
        content: content
      };
      this.socket$.next(message);
    } else {
      console.error('WebSocket connection is not established.');
    }
  }

  public getMessages(): Observable<any> {
    return this.socket$ ? this.socket$.asObservable() : EMPTY;
  }

  public close(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
