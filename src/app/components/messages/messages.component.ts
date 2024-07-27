import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/websocket.service';

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
  public recipientId: string = ''; // ID of the recipient client
  public myClientId: string = ''; // ID for the current client

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.messagesSubscription = this.webSocketService.getMessages().subscribe(
      (message) => {
        if (message.type === 'message') {
          this.messages.push({
            ...message,
            isSelf: message.from === this.webSocketService.clientId
          });
        } else {
          this.messages.push(message);
        }
        console.log('Received message:', message);
      },
      (err) => console.error(err),
      () => console.log('WebSocket connection closed')
    );
  }

  registerClientId(): void {
    if (this.myClientId.trim()) {
      this.webSocketService.registerClientId(this.myClientId);
    } else {
      console.warn('Client ID cannot be empty');
    }
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