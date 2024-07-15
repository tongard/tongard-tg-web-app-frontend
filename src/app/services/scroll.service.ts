import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollControlService {

  constructor() { }

  blockOverflow(): void {
    document.body.style.overflowY = 'hidden';
    document.body.style.marginTop = '100px';
    document.body.style.height = `${window.innerHeight + 100}px`;
    document.body.style.paddingBottom = '100px';
    window.scrollTo(0, 100);
  }


  makeConfetti(): void {
    import('canvas-confetti').then(confetti => {
      confetti.default({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.7 }
      });
    });
  }

}
