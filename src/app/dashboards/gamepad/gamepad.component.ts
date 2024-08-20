import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// @ts-ignore
import JoystickController from 'joystick-controller';
import { CustomSocketService } from 'src/app/custom.socket.service';

@Component({
  selector: 'app-gamepad',
  standalone: true,
  imports: [],
  templateUrl: './gamepad.component.html',
  styleUrl: './gamepad.component.less'
})
export class GamepadComponent {
  @ViewChild('gamepadContainer', { static: true }) gamepadContainer!: ElementRef;
  joystick: any;
  private lastEmitTime: number = 0;
  private emitInterval: number = 1; // Интервал в миллисекундах

  constructor(private socket: CustomSocketService) {}

  ngAfterViewInit() {
    this.joystick = new JoystickController({
      zone: this.gamepadContainer.nativeElement, // Контейнер для джойстика
      size: 90, // Размер джойстика
      maxRange: 90,
      threshold: 0.1, // Порог для минимального движения
      fadeTime: 250, // Время исчезновения джойстика при отсутствии активности
      color: 'blue', // Цвет джойстика
      multitouch: false, // Включение или отключение мультитача
    },
    (obj: any) => {
      const currentTime = Date.now();
      if (currentTime - this.lastEmitTime > this.emitInterval) {
        obj.y = obj.y + 90;
        obj.x = obj.x + 90;
        console.log(obj)
        this.socket.emit('move-arm', {x:obj.y, y:180-obj.x});
        this.lastEmitTime = currentTime;
      }
    });

    // this.joystick.on('move', (data: any) => {
    //   console.log('Move event:', data);
    // });

    // this.joystick.on('end', () => {
    //   console.log('Joystick released');
    // });
  }
}
