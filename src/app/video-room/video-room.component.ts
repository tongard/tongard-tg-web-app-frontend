import { Component, OnInit } from '@angular/core';
import { JanusService } from '../janus.service';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',

  standalone: true,
})
export class VideoRoomComponent implements OnInit {
  localStream: any;
  remoteStream: any;
//   @ViewChild('localStream', { static: true }) localStream!: ElementRef;
//   @ViewChild('remoteStream', { static: true }) remoteStream!: ElementRef;

  constructor(private janusService: JanusService) {}

  ngOnInit(): void {
    this.startJanusSession();
  }

  async startJanusSession() {
    await this.janusService.createSession();
    await this.janusService.attachToPlugin();
    await this.janusService.createRoom();
    await this.janusService.joinRoom();

    this.startLocalStream();
  }

  startLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        const localVideo = document.getElementById(
          'localVideo'
        ) as HTMLVideoElement;
        localVideo.srcObject = this.localStream;
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  }
}
