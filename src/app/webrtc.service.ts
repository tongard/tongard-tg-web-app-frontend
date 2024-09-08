import { Injectable } from '@angular/core';

import { io, Socket } from 'socket.io-client';
declare var Janus: any; 

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {

  private janus: any;
  private session: any;
  private pluginHandle: any;

  constructor() {
    this.initJanus();
  }

  private initJanus() {
    Janus.init({
      debug: 'all',
      callback: () => {
        
        this.janus = new Janus({
          server: 'https://tongard.org/janus',
          success: (e:any) => {
            console.log(e)
           this.createSession();
           
          },
          error: (error: any) => {
            console.error('Janus initialization error:', error);
          },
          destroyed: () => {
            console.log('Janus destroyed');
          }
        });
      }
    });
  }

  private createSession() {
    console.log(this.janus)
    this.janus.createSession({
      success: (session: any) => {
        this.session = session;
        this.attachToPlugin();
      },
      error: (error: any) => {
        console.error('Session creation error:', error);
      }
    });
  }

  private attachToPlugin() {
    this.session.attach({
      plugin: 'janus.plugin.videoroom',
      success: (pluginHandle: any) => {
        this.pluginHandle = pluginHandle;
        this.joinRoom();
      },
      error: (error: any) => {
        console.error('Plugin attachment error:', error);
      },
      onmessage: (msg: any, jsep: any) => {
        this.handleMessage(msg, jsep);
      },
      onremotestream: (stream: any) => {
        console.log('Remote stream received:', stream);
      },
      oncleanup: () => {
        console.log('Plugin cleanup');
      }
    });
  }

  private joinRoom() {
    const body = {
      request: 'join',
      room: 1234,
      ptype: 'subscriber',
    };

    this.pluginHandle.send({
      message: body,
      success: (result: any) => {
        console.log('Joined room:', result);
        // Дополнительные действия после присоединения
      },
      error: (error: any) => {
        console.error('Error joining room:', error);
      }
    });
  }

  private handleMessage(msg: any, jsep: any) {
    console.log('Received message:', msg);
    if (jsep) {
      this.pluginHandle.handleRemoteJsep({ jsep: jsep });
    }
  }





  
 
}
