import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { AudioService } from '../audio-service.service';

@Component({
  selector: 'app-volume-bar',
  templateUrl: './volume-bar.component.html',
  styleUrls: ['./volume-bar.component.less']
})
export class VolumeBarComponent implements OnInit {
  volume: number = 0;
  state: string = "uninit";

  volumeDisplay = this.volume;

  width = 50;
  height = 200;
  private svg: any;
  private x: any;
  private y: any;
  private bar: any;

  constructor(private audioService: AudioService) { }

  valumeScale = d3.scaleLinear()
    .domain([-70, 0])
    .range([0, this.height])

  valumeScaleNoNagetive(input: number) {
    let res = this.valumeScale(input);
    if(!res || res < 0) {
      return 0;
    } else {
      return res;
    }
  }

  ngOnInit() {
    this.initChart();

    this.audioService.getVolumeObservable().subscribe(newVolume => {
      this.volume = newVolume;
      this.updateChart();
    });

    this.audioService.getStateObservable().subscribe(newState => {
      this.state = newState;
    });

    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  private initChart() {
    this.svg = d3.select('.chart-container').append('svg')
      .attr("viewBox", [0, 0, this.width, this.height]);

    const barHeight = this.valumeScaleNoNagetive(this.volume);

    this.svg.append("rect")
      .attr("fill", "steelblue")
      .attr("width", 20)
      .attr("height", barHeight)
      .attr("x", 10)
      .attr("y", barHeight);
  }

  private updateChart() {
    if (this.state !== "started") {
      return;
    }

    const barHeight = this.valumeScaleNoNagetive(this.volume);

    this.svg.select("rect")
      .attr("fill", "steelblue")
      .attr("width", 20)
      .attr("height", barHeight)
      .attr("x", 10)
      .attr("y", this.height - barHeight);
  }
}
