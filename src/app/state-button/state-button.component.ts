import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { AudioService } from '../audio-service.service';
@Component({
  selector: 'app-state-button',
  templateUrl: './state-button.component.html',
  styleUrls: ['./state-button.component.less']
})
export class StateButtonComponent {
  state = "uninit";
  btnClass = "btn btn-success";
  iconClass = "bi bi-play-fill";

  constructor (private audioService: AudioService) { }

  ngOnInit() {
    this.audioService.getStateObservable().subscribe(newState => {
      this.state = newState;
      this.setClass();
    });
  }

  ngOnChanges() {
    this.setClass();
  }

  onClick() {
    if(this.state === "waiting") {
      return;
    }
    this.audioService.switch();
  }

  setClass() {
    if(this.state === "uninit" || this.state === "paused") {
      this.btnClass = "btn btn-success";
      this.iconClass = "bi bi-play-fill";
    } else if (this.state === "started") {
      this.btnClass = "btn btn-warning";
      this.iconClass = "bi bi-pause-fill";
    } else if (this.state === "waiting") {
      this.btnClass = "btn btn-info";
      this.iconClass = "bi bi-hourglass-top"
    }
  }
}
