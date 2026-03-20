import { Injectable } from '@angular/core';
import { Subject, Observable, EMPTY, ReplaySubject } from 'rxjs';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { catchError, shareReplay, tap } from 'rxjs/operators';

/**
 * Service Angular pour gérer la connexion WebSocket avec l'API YAMZY AI.
 * Permet d'envoyer des messages et de recevoir des réponses de l'IA.
 */
@Injectable({
  providedIn: 'root',
})
export class CarnivalWebsocketService {
  // TODO: Remplacer par l'URL réelle de l'API WebSocket YAMZY AI.
  // Peut être configuré via un service de configuration ou l'environnement JHipster.
  private readonly WS_URL: string = 'ws://localhost:8080/websocket/yamzy-ai';
  private socket$: WebSocketSubject<any> | null = null;

  // Sujet pour diffuser les messages reçus de l'IA
  private messagesSubject = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();

  // Sujet pour diffuser l'état de la connexion (connecté/déconnecté)
  // ReplaySubject assure que les nouveaux abonnés reçoivent la dernière valeur émise.
  private connectionStatusSubject = new ReplaySubject<boolean>(1);
  public isConnected$: Observable<boolean> = this.connectionStatusSubject.asObservable();

  constructor() {}

  /**
   * Établit une connexion WebSocket avec l'API YAMZY AI.
   * Si la connexion est déjà établie, une alerte est affichée.
   */
  public connect(): void {
    if (this.socket$ && !this.socket$.closed) {
      console.warn('CarnivalWebsocketService: WebSocket est déjà connecté.');
      return;
    }

    const config: WebSocketSubjectConfig<any> = {
      url: this.WS_URL,
      openObserver: {
        next: () => {
          console.log('CarnivalWebsocketService: Connexion WebSocket établie à', this.WS_URL);
          this.connectionStatusSubject.next(true);
        },
      },
      closeObserver: {
        next: () => {
          console.log('CarnivalWebsocketService: Connexion WebSocket fermée.');
          this.socket$ = null; // Réinitialise l'instance du socket
          this.connectionStatusSubject.next(false);
        },
      },
      // Par défaut, RxJS WebSocketSubject utilise JSON.parse pour les messages entrants
      // et JSON.stringify pour les messages sortants.
      // Deserializer: msg => JSON.parse(msg.data),
      // Serializer: value => JSON.stringify(value),
    };

    this.socket$ = webSocket(config);

    // S'abonne au flux du WebSocket pour écouter les messages et gérer les erreurs
    this.socket$
      .pipe(
        // Opérateur tap pour loguer chaque message reçu
        tap(message => console.debug('CarnivalWebsocketService: Message reçu:', message)),
        // Gestion des erreurs du flux WebSocket
        catchError(error => {
          console.error('CarnivalWebsocketService: Erreur WebSocket:', error);
          this.connectionStatusSubject.next(false);
          this.socket$ = null; // Assure que le socket est marqué comme non connecté
          return EMPTY; // Empêche le flux de se compléter en cas d'erreur
        }),
        // shareReplay assure que plusieurs abonnés partagent la même connexion WebSocket sous-jacente
        // et que les nouveaux abonnés reçoivent les derniers messages.
        shareReplay({ refCount: true, bufferSize: 1 })
      )
      .subscribe({
        next: msg => this.messagesSubject.next(msg), // Diffuse le message via messagesSubject
        error: err => console.error('CarnivalWebsocketService: Erreur d\'abonnement WebSocket:', err),
        complete: () => console.log('CarnivalWebsocketService: Flux WebSocket complété.'),
      });
  }

  /**
   * Envoie un message à l'API YAMZY AI via la connexion WebSocket.
   * Le message doit être un objet JSON.
   * @param message L'objet message à envoyer.
   */
  public sendMessage(message: any): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(message);
      console.debug('CarnivalWebsocketService: Message envoyé:', message);
    } else {
      console.error('CarnivalWebsocketService: Impossible d\'envoyer le message: WebSocket non connecté ou fermé.');
    }
  }

  /**
   * Ferme la connexion WebSocket.
   */
  public disconnect(): void {
    if (this.socket$) {
      this.socket$.complete(); // Ferme proprement le WebSocket et déclenche closeObserver
      this.socket$ = null;
    }
  }
}