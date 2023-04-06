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
  ampArray:Array<Object> = [];
  ampArrayIndex = 0;
  ampSeq = 0;
  fps = 30;
  displaySec = 10;

  ampArrayLimit = this.fps * this.displaySec * 2;

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
        this.ampArray[this.ampArrayIndex] = ({index: this.ampSeq, maxValue: this.maxVolume, minValue: this.minVolume})
        ++this.ampSeq;
        ++this.ampArrayIndex;
        if(this.ampArrayIndex > this.ampArrayLimit) {
          this.ampArrayIndex = 0;
        }
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
    this.width = this.svg.node().clientWidth;

    const xScale = d3.scaleLinear()
      .domain([this.ampSeq, this.ampSeq - this.fps * this.displaySec])
      .range([this.width, 0])

    const heightScaleMax = d3.scaleLinear()
      .domain([0, 1])
      .range([0, this.height / 2])

    this.svg.selectAll('rect')
    .data(this.ampArray)
    .join('rect')
      .attr("fill", "steelblue")
      .attr("width", 3)
      .attr("height", (d: any) => {
        if(!d.maxValue || d.maxValue < 0) {
          return 0;
        } else {
          return heightScaleMax(d.maxValue) + heightScaleMax(-d.minValue);
        }
      })
      .attr("x", (d: any) => xScale(d.index))
      .attr("y",  (d: any) => {
        if(!d.maxValue || d.maxValue < 0) {
          return this.height / 2;
        } else {
          return this.height / 2 - heightScaleMax(d.maxValue);
        }
      })
  }
}
