import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';
import { CarnivalWebsocketService } from './carnival-websocket.service'; // Assuming this service will be created in the same directory

// Define interfaces/types used within the component
interface Message {
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

type TicketType = 'story' | 'bug' | 'feature';

interface SuggestedTicket {
  type: TicketType;
  description: string;
}

@Component({
  selector: 'jhi-carnival-widget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
  ],
  templateUrl: './carnival-widget.component.html',
  styleUrls: ['./carnival-widget.component.scss'],
})
export class CarnivalWidgetComponent implements OnInit, OnDestroy {
  isWidgetOpen = false;
  messages: Message[] = [];
  newMessage = '';
  isLoading = false;
  error: string | null = null;
  suggestedTicket: SuggestedTicket | null = null;

  private websocketSubscription: Subscription | undefined;

  constructor(private carnivalWebsocketService: CarnivalWebsocketService) {}

  ngOnInit(): void {
    this.carnivalWebsocketService.connect();
    this.websocketSubscription = this.carnivalWebsocketService.onMessage().subscribe({
      next: (rawMessage: string) => this.handleIncomingMessage(rawMessage),
      error: (err: any) => {
        console.error('WebSocket error with YAMZY AI:', err);
        this.error = 'Erreur de connexion avec YAMZY AI.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('WebSocket connection to YAMZY AI closed.');
        this.error = 'Connexion YAMZY AI fermée.';
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.websocketSubscription?.unsubscribe();
    this.carnivalWebsocketService.disconnect();
  }

  toggleWidget(): void {
    this.isWidgetOpen = !this.isWidgetOpen;
    // Optional: when opening the widget, ensure scroll to bottom if there are messages
    if (this.isWidgetOpen && this.messages.length > 0) {
      setTimeout(() => this.scrollToChatBottom(), 0);
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }

    const userMessage: Message = {
      sender: 'user',
      content: this.newMessage,
      timestamp: new Date(),
    };
    this.messages.push(userMessage);
    this.isLoading = true;
    this.error = null;

    this.carnivalWebsocketService.sendMessage(this.newMessage);
    this.newMessage = '';

    setTimeout(() => this.scrollToChatBottom(), 0);
  }

  handleIncomingMessage(rawMessage: string): void {
    this.isLoading = false;
    try {
      const parsedMessage = JSON.parse(rawMessage);

      // Example AI response structure:
      // { "type": "chat", "content": "Hello! How can I help you?" }
      // { "type": "ticket_suggestion", "ticket": { "type": "bug", "description": "User reported an issue with login." } }

      if (parsedMessage.type === 'chat' && parsedMessage.content) {
        const aiMessage: Message = {
          sender: 'ai',
          content: parsedMessage.content,
          timestamp: new Date(),
        };
        this.messages.push(aiMessage);
      } else if (parsedMessage.type === 'ticket_suggestion' && parsedMessage.ticket && parsedMessage.ticket.type && parsedMessage.ticket.description) {
        this.suggestedTicket = {
          type: parsedMessage.ticket.type as TicketType,
          description: parsedMessage.ticket.description,
        };
        const aiTicketSuggestionMessage: Message = {
          sender: 'ai',
          content: `YAMZY AI a détecté un besoin de changement et suggère un ticket de type "${this.suggestedTicket.type}" : "${this.suggestedTicket.description}". Voulez-vous le créer ?`,
          timestamp: new Date(),
        };
        this.messages.push(aiTicketSuggestionMessage);
      } else {
        // Fallback for unexpected messages or simple string messages
        const aiMessage: Message = {
          sender: 'ai',
          content: `[YAMZY AI] ${rawMessage}`, // Prefix to distinguish
          timestamp: new Date(),
        };
        this.messages.push(aiMessage);
      }
    } catch (e) {
      console.warn('Could not parse incoming message as JSON, treating as plain text:', rawMessage);
      const aiMessage: Message = {
        sender: 'ai',
        content: `[YAMZY AI] ${rawMessage}`,
        timestamp: new Date(),
      };
      this.messages.push(aiMessage);
    }

    setTimeout(() => this.scrollToChatBottom(), 0);
  }

  createTicketFromSuggestion(): void {
    if (this.suggestedTicket) {
      // In a real application, this would involve calling a backend API via the service
      // or sending a specific message through the WebSocket to trigger backend action.
      console.log(`Sending request to create ticket: Type=${this.suggestedTicket.type}, Description=${this.suggestedTicket.description}`);

      this.messages.push({
        sender: 'ai',
        content: `Confirmation: Ticket de type "${this.suggestedTicket.type}" avec la description "${this.suggestedTicket.description}" est en cours de création.`,
        timestamp: new Date(),
      });

      // Simulate sending confirmation to YAMZY AI
      this.carnivalWebsocketService.sendMessage(JSON.stringify({
        type: 'ticket_action',
        action: 'create',
        ticket: this.suggestedTicket,
        userConfirmation: true
      }));

      this.suggestedTicket = null; // Clear the suggestion after user action
      setTimeout(() => this.scrollToChatBottom(), 0);
    }
  }

  dismissSuggestedTicket(): void {
    this.messages.push({
      sender: 'ai',
      content: `Suggestion de ticket ignorée. YAMZY AI reste à votre disposition.`,
      timestamp: new Date(),
    });

    // Simulate sending dismissal to YAMZY AI
    this.carnivalWebsocketService.sendMessage(JSON.stringify({
      type: 'ticket_action',
      action: 'dismiss',
      userConfirmation: true
    }));

    this.suggestedTicket = null; // Clear the suggestion
    setTimeout(() => this.scrollToChatBottom(), 0);
  }

  private scrollToChatBottom(): void {
    const chatContainer = document.querySelector('.carnival-chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
}