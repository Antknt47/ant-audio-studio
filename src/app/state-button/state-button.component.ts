import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-state-button',
  templateUrl: './state-button.component.html',
  styleUrls: ['./state-button.component.less']
})
export class StateButtonComponent {
  @Input() state = "uninit";

  @Output() click = new EventEmitter();

  btnClass = "btn btn-success";
  iconClass = "bi bi-play-fill";

  ngOnChanges() {
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

  onClick() {
    if(this.state === "waiting") {
      return;
    }
    this.click.emit();
  }
}
