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
  @ViewChild('gamepadContainerRight', { static: true }) gamepadContainerRight!: ElementRef;
  joystick: any;
  joystickRight:any;
  private lastEmitTime: number = 0;
  private emitInterval: number = 1; // Интервал в миллисекундах
  coordinates = {
    x:90,
    y:90,
    z:90
  }

  constructor(private socket: CustomSocketService) {}

  ngAfterViewInit() {
    this.joystick = new JoystickController({
      distortion:true,
      containerClass: "joystick-container",
      controllerClass: "joystick-controller",
      joystickClass: "joystick",
      zone: this.gamepadContainer.nativeElement, // Контейнер для джойстика
      size: 90, // Размер джойстика
      maxRange: 90,
      threshold: 0.1, // Порог для минимального движения
      fadeTime: 250, // Время исчезновения джойстика при отсутствии активности
      color: 'blue', // Цвет джойстика
      multitouch: true, // Включение или отключение мультитача
      x:"12%",
      y:"18%"
    },
    (obj: any) => {
      const currentTime = Date.now();
      if (currentTime - this.lastEmitTime > this.emitInterval) {
        obj.y = obj.y + 90;
        obj.x = obj.x + 90;

        this.coordinates = {...this.coordinates, x:obj.y, y:180-obj.x}
        this.socket.emit('move-arm', this.coordinates);
        this.lastEmitTime = currentTime;
      }
    });


    this.joystickRight = new JoystickController({
      distortion:true,
      containerClass: "joystick-container",
      controllerClass: "joystick-controller",
      joystickClass: "joystick",
      zone: this.gamepadContainerRight.nativeElement, // Контейнер для джойстика
      size: 90, // Размер джойстика
      maxRange: 90,
      threshold: 0.1, // Порог для минимального движения
      fadeTime: 250, // Время исчезновения джойстика при отсутствии активности
      color: 'blue', // Цвет джойстика
      multitouch: true, // Включение или отключение мультитача
      x:"72%",
      y:"18%"
    },
    (obj: any) => {
      const currentTime = Date.now();
      if (currentTime - this.lastEmitTime > this.emitInterval) {
        obj.y = obj.y + 90;
        obj.x = obj.x + 90;
        this.coordinates = {...this.coordinates, z:obj.y}
        this.socket.emit('move-arm', this.coordinates);
        this.lastEmitTime = currentTime;
      }
    });


  }

  ngOnDestroy(){
    this.joystick.destroy()
    this.joystickRight.destroy()
  }
}
