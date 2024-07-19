import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {
    socket.onAny((e=>{
        console.log('any: ', e)
    }))
  }

  // Пример метода для отправки события на сервер
  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Пример метода для получения события от сервера
  onEvent(event: string): Observable<any> {
    return this.socket.fromEvent(event);
  }

  // Пример метода для подключения к серверу
  connect(token: string) {
    this.socket.ioSocket.io.opts.query = { token };
    this.socket.connect();
  }

  // Пример метода для отключения от сервера
  disconnect() {
    this.socket.disconnect();
  }
}
