import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomSocketService {
  private socket$: BehaviorSubject<Socket | null> = new BehaviorSubject<Socket | null>(null);

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
          return socket.fromEvent<any>('connect');
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
}