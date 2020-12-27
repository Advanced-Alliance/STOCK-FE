import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-answer-card',
  templateUrl: './answer-card.component.html',
  styleUrls: ['./answer-card.component.scss'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateX(179deg)'
        //transform: 'rotateY(179deg)'
      })),
      state('inactive', style({
        transform: 'rotateX(0)'
        //transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('400ms ease-out')),
      transition('inactive => active', animate('400ms ease-in'))
    ])
  ]
})
export class AnswerCardComponent {
  @Input()
  answer: any;

  @Input()
  num: number;

  @Input()
  id: number;

  @Output()
  answeredCb: EventEmitter<any> = new EventEmitter();

  flip = 'inactive';
  guessMe = 'Отгадай-ка!';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.firstValue) {
      return;
    }

    this.flip = 'inactive';
  }

  toggleFlip() {
    // reject any new re-opens of the answer
    if (this.flip === 'active') {
      return;
    }
    this.flip = (this.flip === 'inactive') ? 'active' : 'inactive';
    if (this.flip === 'active') {
      this.answeredCb.emit(this.id);
    }
  }
}
