import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesComponent } from './components/messages/messages.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MessagesComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'momentum';
}
