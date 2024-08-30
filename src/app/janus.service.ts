import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class JanusService {
  private server = 'http://tongard.org:8088/janus';
  private janusWsUrl = 'ws://tongard.org:8188/janus'; // URL для WebSocket соединения

  private sessionId: any;
  private pluginHandleId: any;

  constructor() {}

  createSession() {
    return fetch(this.server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        janus: 'create',
        transaction: this.generateTransactionId(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.sessionId = data.data.id;
        console.log('Session created:', this.sessionId);
      });
  }

  attachToPlugin() {
    return fetch(`${this.server}/${this.sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        janus: 'attach',
        plugin: 'janus.plugin.videoroom',
        transaction: this.generateTransactionId(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.pluginHandleId = data.data.id;
        console.log('Plugin attached:', this.pluginHandleId);
      });
  }

  createRoom() {
    return fetch(`${this.server}/${this.sessionId}/${this.pluginHandleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        janus: 'message',
        body: {
          request: 'create',
          room: 1234,
          publishers: 10,
        },
        transaction: this.generateTransactionId(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Room created:', data);
      });
  }

  joinRoom() {
    return fetch(`${this.server}/${this.sessionId}/${this.pluginHandleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        janus: 'message',
        body: {
          request: 'join',
          room: 1234,
          ptype: 'publisher',
          display: 'Angular Client',
        },
        transaction: this.generateTransactionId(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Joined room:', data);
      });
  }

  private generateTransactionId() {
    return Math.random().toString(36).substring(2, 12);
  }
}
