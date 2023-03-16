import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioState: 'uninit' | 'started' | 'paused' | 'waiting' = 'uninit';
  private stateSubject = new Subject<'uninit' | 'started' | 'paused' | 'waiting'>();

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

  constructor() {
    console.log("AudioService init.")
  }

  getStateObservable(): Observable<'uninit' | 'started' | 'paused' | 'waiting'> {
    return this.stateSubject.asObservable();
  }

  start(): void {
    // Lock state if waiting.
    if (this.audioState === 'waiting') {
      return;
    }

    if (this.audioState === 'uninit') {
      this.audioInit();
    } else if (this.audioState === 'paused') {
      this.audioState = 'started';
      this.stateSubject.next(this.audioState);
    }
  }

  pause(): void {
    // Lock state if waiting.
    if (this.audioState === 'waiting') {
      return;
    }

    if (this.audioState !== 'paused') {
      this.audioState = 'paused';
      this.stateSubject.next(this.audioState);
    }
  }

  switch(): void {
    // Lock state if waiting.
    if (this.audioState === 'waiting') {
      return;
    }

    // Switch state.
    if (this.audioState === 'started') {
      this.pause();
    } else { // init or paused
      this.start();
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
    this.stateSubject.next(this.audioState);
    navigator.mediaDevices.getUserMedia({ 'audio': true }).then((stream) => {
      this.audioStream = stream;
      this.audioSource = this.audioCtx.createMediaStreamSource(this.audioStream);
      if (this.audioSource) {
        this.sampleRate = this.audioCtx.sampleRate;
        this.audioState = "started";
        this.stateSubject.next(this.audioState);
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.audioSource.connect(this.analyser);
      console.log(`sampleRate: ${this.audioCtx.sampleRate}`)

      setInterval(() => {
        let originData = new Float32Array(this.analyser.fftSize / 2);
        this.analyser.getFloatTimeDomainData(originData);
        this.volume = this.calculateDB(originData);
      }, 1000 / 20);

    });
  }
}
