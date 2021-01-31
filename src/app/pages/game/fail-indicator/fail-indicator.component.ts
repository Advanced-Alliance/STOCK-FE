import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'fail-indicator',
  styleUrls: ['fail-indicator.component.scss'],
  templateUrl: './fail-indicator.component.html'
})

export class FailIndicatorComponent implements OnInit, OnChanges {

  @Input() fails: number = 0;
  @Input() failsMax: number = 3;

  @Output()
  private failed: EventEmitter<number> = new EventEmitter();

  indicatorsEmpty: number[];
  indicatorsFailed: number[];

  ngOnInit(): void {
    this.initArrays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('failsMax' in changes || 'fails' in changes) {
      this.initArrays();
    }
  }

  private initArrays() {
    if (this.fails > this.failsMax) this.fails = this.failsMax;
    this.indicatorsFailed = Array(this.fails).fill(0).map((x, i) => i);
    this.indicatorsEmpty = Array(this.failsMax - this.fails)
      .fill(0).map((x, i) => i);
  }

  onFail() {
    this.fails++;
    this.failed.emit(this.fails);
  }
}
