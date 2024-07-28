import { Injectable, OnDestroy } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomSocketService implements OnDestroy {
  private socket$: BehaviorSubject<Socket | null> = new BehaviorSubject<Socket | null>(null);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private tokenService: TokenService) {
    this.tokenService.token$.pipe(
      switchMap((token) => {
        if (token) {
          const config: SocketIoConfig = {
            url: environment.baseUrl, // Замените на ваш URL
            options: {
              query: {
                token: token,
              },
            },
          };

          const socket = new Socket(config);
          this.socket$.next(socket);
          return socket.fromEvent<any>('connect').pipe(takeUntil(this.destroy$));
        } else {
          this.socket$.next(null);
          return [];
        }
      })
    ).subscribe();
  }

  on(event: string): Observable<any> {
    const socket = this.socket$.getValue();
    return socket ? socket.fromEvent(event) : new Observable<any>();
  }

  emit(event: string, data: any): void {
    const socket = this.socket$.getValue();
    if (socket) {
      socket.emit(event, data);
    }
  }

  disconnect(): void {
    const socket = this.socket$.getValue();
    if (socket) {
      socket.disconnect();
      this.socket$.next(null); // Убедитесь, что после отключения вы очищаете текущее значение
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect(); // Закрываем сокет при уничтожении сервиса
  }
}
