// game.service.ts
import { Injectable } from '@angular/core';
import { GameServiceBase } from './game.service.shared';



export const logger: Console = console;

@Injectable({
  providedIn: 'root'
})
export class GameService extends GameServiceBase {

  constructor(){
    super();
    this.logger  = logger;
  }

}