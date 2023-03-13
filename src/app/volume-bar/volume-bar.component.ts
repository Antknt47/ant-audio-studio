import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-volume-bar',
  templateUrl: './volume-bar.component.html',
  styleUrls: ['./volume-bar.component.less']
})
export class VolumeBarComponent implements OnInit {
  @Input() volume: number = 0;
  @Input() state: string = "uninit";

  volumeDisplay = this.volume;

  width = 50;
  height = 200;
  private svg: any;
  private x: any;
  private y: any;
  private bar: any;

  valumeScale = d3.scaleLinear()
    .domain([-70, 0])
    .range([0, this.height])

  ngOnInit() {
    this.initChart();
    this.updateChart();
  }

  ngOnChanges() {
    if (this.state === "started") {
      this.updateChart();
      this.volumeDisplay = this.volume;
    }
  }

  private initChart() {
    this.svg = d3.select('.chart-container').append('svg')
      .attr("viewBox", [0, 0, this.width, this.height]);

    this.svg.append("rect")
      .attr("fill", "steelblue")
      .attr("width", 20)
      .attr("height", this.valumeScale(this.volume))
      .attr("x", 10)
      .attr("y", this.valumeScale(this.volume));

    this.svg.append("g")
      .call(d3.axisLeft(this.valumeScale));
  }

  private updateChart() {

    this.svg.select("rect")
      .attr("fill", "steelblue")
      .attr("width", 20)
      .attr("height", this.valumeScale(this.volume))
      .attr("x", 10)
      .attr("y", this.height - this.valumeScale(this.volume));

  }
}
