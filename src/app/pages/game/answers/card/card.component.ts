import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { GameService } from '../../game.service';
import { BaseComponent } from './../../../../core/base.component';
import { delay, filter, tap } from 'rxjs';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('flipState', [
      state(
        'opened',
        style({
          transform: 'rotateX(179deg)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'rotateX(0)',
        })
      ),
      transition('opened => closed', animate('400ms ease-out')),
      transition('closed => opened', animate('400ms ease-in')),
    ]),
  ],
  standalone: true,
})
export class CardComponent extends BaseComponent implements OnInit {
  @Input() text?: string;
  @Input() points?: number;
  @Input() id: number;

  flip: 'opened' | 'closed' = 'closed';

  constructor(private gameService: GameService, private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    const cardChanges$ = this.gameService.answerInstant$.pipe(
      filter(({ id }) => id === this.id)
    );

    cardChanges$
      .pipe(
        filter(({ opened }) => opened),
        this.unsubscribeOnDestroy
      )
      .subscribe(({ text, points }) => {
        this.text = text;
        this.points = points;
        this.openCard();
      });

    cardChanges$
      .pipe(
        filter(({ opened }) => !opened),
        tap(() => this.closeCard()),
        delay(500),
        this.unsubscribeOnDestroy
      )
      .subscribe(() => {
        delete this.text;
        delete this.points;
      });
  }

  openCard(): void {
    this.flip = 'opened';
    this.cd.markForCheck();
  }

  closeCard(): void {
    this.flip = 'closed';
    this.cd.markForCheck();
  }
}
