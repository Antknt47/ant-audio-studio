import { Component } from '@angular/core';
import { max } from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  // Static values
  title = '𝔸𝕟𝕥 𝔸𝕦𝕕𝕚𝕠 𝕊𝕥𝕦𝕕𝕚𝕠';

  // Audio objects
  audioCtx!: AudioContext;
  audioStream!: MediaStream;
  audioSource!: MediaStreamAudioSourceNode;
  analyser!: AnalyserNode;
  
  // Audio datas
  fftSize = 4096;
  volume = 0;
  sampleRate = 0;
  f0 = 0;

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

  calculateDB(originData : Float32Array) {
    let sum = 0;
    for (let i = 0; i < originData.length; i++) {
      sum += originData[i] * originData[i];
    }
    const rms = Math.sqrt(sum / originData.length);
    
    const dbfs = 20 * Math.log10(rms / 1);
    
    return dbfs;
  }

  audioInit() {
    this.audioCtx = new (window.AudioContext)();
    this.audioState = "waiting";
    navigator.mediaDevices.getUserMedia({ 'audio': true }).then((stream) => {
      this.audioStream = stream;
      this.audioSource = this.audioCtx.createMediaStreamSource(this.audioStream);
      if (this.audioSource) {
        this.sampleRate = this.audioCtx.sampleRate;
        this.audioState = "started";
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.audioSource.connect(this.analyser);
      console.log(`sampleRate: ${this.audioCtx.sampleRate}`)

      setInterval(()=>{
        let originData = new Float32Array(this.analyser.fftSize / 2);
        this.analyser.getFloatTimeDomainData(originData);
        this.volume = this.calculateDB(originData);
      }, 1000/20);

    });
  }

  audioPause() {
    this.audioState = "paused";
  }

  audioRestart() {
    this.audioState = "started";
  }
}
