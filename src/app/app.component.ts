import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  // Static values
  static title = 'ant-audio-studio';

  // Audio objects
  audioCtx!: AudioContext;
  audioStream!: MediaStream;
  audioSource!: MediaStreamAudioSourceNode;

  // State control values
  audioState: string = "uninit";

  ngOnInit() {
    console.log("app init");
  }

  // State button's on click function
  // Controls state machine manually.
  audioCtrlBtnFunc() {
    console.log("audioCtrlBtnFunc:", this.audioState);
    switch (this.audioState) {
      case "uninit":
        this.audioInit();
        break;
      case "started":
        this.audioPause();
        break;
      case "paused":
        this.audioRestart();
        break;
    }
  }

  audioInit() {
    this.audioCtx = new (window.AudioContext)();
    this.audioState = "waiting";
    navigator.mediaDevices.getUserMedia({ 'audio': true }).then((stream) => {
      this.audioStream = stream;
      this.audioSource = this.audioCtx.createMediaStreamSource(this.audioStream);
      if (this.audioSource) {
        this.audioState = "started";
      }
    });
  }

  audioPause() {
    this.audioState = "paused";
  }

  audioRestart() {
    this.audioState = "started";
  }
}
