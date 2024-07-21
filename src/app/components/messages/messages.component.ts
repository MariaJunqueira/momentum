import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.messagesSubscription = this.webSocketService.getMessages().subscribe(
      (message) => {
        // Directly handle the message
        this.messages.push(message);
        console.log('Received message:', message);
      },
      (err) => console.error(err),
      () => console.log('WebSocket connection closed')
    );
  }

  sendMessage(): void {
    const message = { type: 'message', content: this.newMessage };
    this.webSocketService.sendMessage(message);
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
    this.webSocketService.close();
  }
}
