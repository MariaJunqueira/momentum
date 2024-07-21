import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  public clientId: string = ''; // Store the client ID

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080');

    // Handle messages from the server
    this.socket$.subscribe(
      (message) => {
        if (message.type === 'system') {
          this.clientId = message.clientId; // Store the client ID
        }
        console.log('Received message:', message);
      },
      (err) => console.error(err),
      () => console.log('WebSocket connection closed')
    );
  }

  public registerClientId(id: string): void {
    const message = { type: 'register', clientId: id };
    this.socket$.next(message); // Send registration message
  }

  public sendMessage(to: string, content: string): void {
    const message = {
      type: 'message',
      to: to, // Recipient's client ID
      content: content
    };
    this.socket$.next(message); // Send message
  }

  public getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  public close(): void {
    this.socket$.complete();
  }
}
