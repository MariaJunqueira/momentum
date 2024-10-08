import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/websocket.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MessagesComponent implements OnInit, OnDestroy {
  private messagesSubscription!: Subscription;
  public messages: any[] = [];
  public newMessage: string = '';
  public recipientId: string = '';
  public myClientId: string = '';

  constructor(private webSocketService: WebSocketService, private authService: AuthService) { }

  ngOnInit(): void {
    this.myClientId = this.authService.getUser().username
    // Subscribe to WebSocket messages
    this.messagesSubscription = this.webSocketService.getMessages().subscribe(
      (message) => {
        this.messages.push(message);
        console.log('Received message:', message);
      },
      (err) => console.error(err),
      () => console.log('WebSocket connection closed')
    );
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.recipientId) {
      this.webSocketService.sendMessage(this.recipientId, this.newMessage);
      this.messages.push({
        type: 'message',
        from: this.webSocketService.clientId,
        content: this.newMessage
      });
      this.newMessage = '';
    } else {
      console.warn('Message or recipient ID cannot be empty');
    }
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
    this.webSocketService.close();
  }
}
