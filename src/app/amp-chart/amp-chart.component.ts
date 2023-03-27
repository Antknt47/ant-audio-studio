import { Component } from '@angular/core';
import * as d3 from 'd3';
import { AudioService } from '../audio-service.service';

@Component({
  selector: 'app-amp-chart',
  templateUrl: './amp-chart.component.html',
  styleUrls: ['./amp-chart.component.less']
})
export class AmpChartComponent {

  width = 0;
  height = 0;
  svg: any;
  barColor = "#66ccff";
  state: string = "uninit";
  amp: number = 0;
  timeDomainData!: Float32Array;
  maxVolume!: number;
  minVolume!: number;
  ampArray = [{index: 0, value: 0} ];
  index = 0;
  fps = 30;

  constructor(private audioService: AudioService) { }

  ngOnInit() {
    this.audioService.getStateObservable().subscribe(newState => {
      this.state = newState;
    });

    this.audioService.getTimeDomainDataObservable().subscribe(datas => {
      this.maxVolume = d3.max(datas)!;
      this.minVolume = d3.min(datas)!;
    });
    this.initChart();
    this.updateChart();
    setInterval(()=>{
      if(this.state === 'started') {
        this.ampArray.push({index: this.index++, value: this.maxVolume * 500})
        this.updateChart();
      }
    }, 1000 / this.fps );
  }

  ngOnChanges() {

  }

  private initChart(): void {
    this.svg = d3.select('#amp-svg');
  }

  private updateChart(): void {
    this.height = this.svg.node().clientHeight;
    this.width = this.svg.attr('width');

    this.svg.selectAll('rect')
    .data(this.ampArray)
    .join('rect')
      .attr("fill", "steelblue")
      .attr("width", 1)
      .attr("height", (d: any) => {
        if(!d.value || d.value < 0) {
          return 0;
        } else {
          return d.value;
        }
      })
      .attr("x", (d: any) => d.index * 1)
      .attr("y",  (d: any) => {
        if(!d.value || d.value < 0) {
          return this.height;
        } else {
          return this.height - d.value;
        }
      })
  }
}
