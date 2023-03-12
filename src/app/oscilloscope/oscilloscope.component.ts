import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-oscilloscope',
  templateUrl: './oscilloscope.component.html',
  styleUrls: ['./oscilloscope.component.less']
})
export class OscilloscopeComponent {
  @Input() audioSource!: MediaStreamAudioSourceNode;
  @Input() audioCtx!: AudioContext;
  analyser!: AnalyserNode;
  svgPathStr = '';
  fftSize = 4096;
  stop = false;

  ngOnInit() {
    console.log(this.audioCtx)
    console.log(this.audioSource)
  }

  ngOnChanges() {
    if(this.audioSource && this.audioCtx) {
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 4096;
      this.audioSource.connect(this.analyser);
      console.log(this.audioCtx.sampleRate)

      setInterval(()=>{
        let originData = new Uint8Array(this.analyser.fftSize / 2);
        this.analyser.getByteTimeDomainData(originData);

        
        let trigger = 0;
        const triggerValue = 130;
        for(let index=1; index<originData.length; ++index) {
          if(originData[index - 1] < triggerValue && originData[index] > triggerValue) {
            trigger = index;
            break;
          }
        }
        console.log(trigger)
        if(!this.stop) {
          this.svgPathStr = `M 10 ${200 - originData[0]}`
          for(let index=trigger; index<originData.length; ++index) {
            this.svgPathStr += `L ${(index-trigger)/2 + 10} ${200 - originData[index]}`
          }
          if(trigger > 0) {
            this.stop = true;
          }
        }

      }, 1000/5);

      //console.log(Math.max(originData));
      
    }
  }
}
