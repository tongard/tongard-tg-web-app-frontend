import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private observers: ((command: any) => void)[] = [];
  private playerId: string | null = null;

  private keydownSubject = new Subject<{ keyPressed: string, playerId: string | null }>();

  constructor() {
    this.keydownSubject.subscribe(command => {
      this.notifyAll(command);
    });

    // Listen to keydown events
    window.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  registerPlayerId(playerId: string): void {
    this.playerId = playerId;
  }

  subscribe(observerFunction: (command: any) => void): void {
    this.observers.push(observerFunction);
  }

  unsubscribeAll(): void {
    this.observers = [];
  }

  private notifyAll(command: { keyPressed: string, playerId: string | null }): void {
    for (const observerFunction of this.observers) {
      observerFunction(command);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    const keyPressed = event.key;

    const command = {
      type: 'move-player',
      playerId: this.playerId,
      keyPressed
    };

    this.keydownSubject.next(command);
  }
}