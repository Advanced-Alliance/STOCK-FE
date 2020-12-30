import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GameService } from './game.service';
import { AnswerCardComponent } from './answer-card/answer-card.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { GameApiService } from './game-api.service';


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
    GameApiService,
    GameService,
  ]
})
export class GameModule { }
