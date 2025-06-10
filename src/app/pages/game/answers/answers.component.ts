import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CardComponent } from './card/card.component';
import { IAnswer } from './../../../models/models';
import { GameService } from '../game.service';
import { AsyncPipe } from '@angular/common';
import { BaseComponent } from './../../../core/base.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'answers',
  imports: [CardComponent, AsyncPipe],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswersComponent extends BaseComponent implements OnChanges {
  @Input() count: number;

  answerList$ = new BehaviorSubject<
    { id: number; text?: string; points?: number }[]
  >([]);

  @Output() open: EventEmitter<number> = new EventEmitter();

  readonly answerInstant$ = this.gameService.answerInstant$;

  constructor(private gameService: GameService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.answers || changes.count) this.updateAnswerList();
  }

  private updateAnswerList(): void {
    if (!this.count) return;
    const list = Array(this.count)
      .fill({})
      .map((obj, id) => {
        return { id };
      });

    this.answerList$.next(list);
  }
}
