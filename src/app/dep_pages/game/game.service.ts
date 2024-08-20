// game.service.ts
import {  Injectable } from '@angular/core';
import { GameServiceBase } from './game.service.shared';
import { LoggerService } from '../../app.logger.storage';
import { environment } from '../../../environments/environment';


export const logger: Console = console;

@Injectable({
  providedIn: 'root'
})
export class GameService extends GameServiceBase {

  constructor(){
    super();
    if(!environment.production)
      this.logger  = new LoggerService();
  }

  public getLogger(){
    this.logger.exportLogsToFile()
  }

}