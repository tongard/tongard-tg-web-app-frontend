import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import JoystickController from 'joystick-controller';
import { CustomSocketService } from 'src/app/custom.socket.service';

@Component({
  selector: 'app-gamepad',
  standalone: true,
  imports: [FormsModule],
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
    z:90,
    d:90
  }

  inputValue: number = 0; // Значение по умолчанию

  onInputChange(value: any) {
    console.log("Текущее значение:", value);
    this.coordinates.z = value;
    this.socket.emit('move-arm', this.coordinates);
    this.cdref.markForCheck()
  }

  constructor(private socket: CustomSocketService, private cdref: ChangeDetectorRef) {}

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
      x:"20%",
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
        this.cdref.markForCheck()
      }
    });


    this.joystickRight = new JoystickController({
      distortion:true,
      containerClass: "joystick-container",
      controllerClass: "joystick-controller",
      joystickClass: "joystick",
      zone: this.gamepadContainerRight.nativeElement, // Контейнер для джойстика
      dynamicPositionTarget: document.getElementById("root"),
      size: 90, // Размер джойстика
      maxRange: 140,
      threshold: 0.1, // Порог для минимального движения
      fadeTime: 250, // Время исчезновения джойстика при отсутствии активности
      color: 'blue', // Цвет джойстика
      multitouch: true, // Включение или отключение мультитача
      x:"80%",
      y:"18%"
    },
    (obj: any) => {
      const currentTime = Date.now();
      if (currentTime - this.lastEmitTime > this.emitInterval) {
        obj.x = obj.x + 140;
        obj.y = obj.y + 140;

        this.coordinates = {...this.coordinates, z:this.mapRange(obj.x, 0, 180, 70, 90), d:140-obj.y}

        this.socket.emit('move-arm', this.coordinates);
        this.lastEmitTime = currentTime;
        this.cdref.markForCheck()
      }
    });


  }

   mapRange(value:any, minFrom:any, maxFrom:any, minTo:any, maxTo:any) {
    return (value - minFrom) * (maxTo - minTo) / (maxFrom - minFrom) + minTo;
  }

  ngOnDestroy(){
    this.joystick.destroy()
    this.joystickRight.destroy()
  }
}
