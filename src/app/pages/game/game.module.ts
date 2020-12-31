import { SharedModule } from './../../shared/shared.module';
import { AnswerCardComponent } from './answer-card/answer-card.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { NgModule } from '@angular/core';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';


@NgModule({
  declarations: [
    GameComponent,
    IndicatorComponent,
    AnswerCardComponent,
  ],
  imports: [
    SharedModule,
    GameRoutingModule // Must be the last one
  ],
  providers: [
  ]
})
export class GameModule { }
