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
  fftAnalyser!: AnalyserNode;

  // Audio datas
  fftSize = 1024;
  f0 = 0;
  fps = 30; // Hz  

  private volume = 0;
  private volumeSubject = new Subject<number>();

  private timeDomainData!: Float32Array;
  private timeDomainDataSubject = new Subject<Float32Array>();

  private freqDomainData!: Uint8Array;
  private freqDomainDataSubject = new Subject<Uint8Array>();

  private sampleRate: number = 0;
  private sampleRateSubject = new Subject<number>();

  constructor() {
    console.log("AudioService init.")
  }

  getStateObservable(): Observable<'uninit' | 'started' | 'paused' | 'waiting'> {
    return this.stateSubject.asObservable();
  }

  getVolumeObservable(): Observable<number> {
    return this.volumeSubject.asObservable();
  }

  getTimeDomainDataObservable(): Observable<Float32Array> {
    return this.timeDomainDataSubject.asObservable();
  }

  getfreqDomainDataObservable(): Observable<Uint8Array> {
    return this.freqDomainDataSubject.asObservable();
  }

  getsampleRateObservable(): Observable<number> {
    return this.sampleRateSubject.asObservable();
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
        this.sampleRateSubject.next(this.sampleRate);
        this.audioState = "started";
        this.stateSubject.next(this.audioState);
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.audioSource.connect(this.analyser);

      this.fftAnalyser = this.audioCtx.createAnalyser();
      this.fftAnalyser.fftSize = 4096;
      this.audioSource.connect(this.fftAnalyser);

      console.log(`sampleRate: ${this.audioCtx.sampleRate}`)

      setInterval(() => {
        if(!this.timeDomainData) {
          this.timeDomainData = new Float32Array(this.analyser.fftSize / 2);
        }
        this.analyser.getFloatTimeDomainData(this.timeDomainData);
        this.timeDomainDataSubject.next(this.timeDomainData);

        if(!this.freqDomainData) {
          this.freqDomainData = new Uint8Array(this.fftAnalyser.fftSize / 2);
        }
        this.fftAnalyser.getByteFrequencyData(this.freqDomainData);
        this.freqDomainDataSubject.next(this.freqDomainData);

        this.volume = this.calculateDB(this.timeDomainData);
        this.volumeSubject.next(this.volume);

      }, 1000 / this.fps);

    });
  }
}
