import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private storageKey = 'logs';

  constructor(){
    localStorage.setItem(this.storageKey, '[]')
  }

  log(level: string = 'info', message: string, additionalData: any = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level,
      message,
      ...additionalData
    };

    const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    logs.push(logEntry);
    localStorage.setItem(this.storageKey, JSON.stringify(logs));
  }

  exportLogsToFile(): void {
    const logs = localStorage.getItem(this.storageKey);

    if (!logs) {
      alert('No logs available to export.');
      return;
    }

    console.log(logs)
  }
}
