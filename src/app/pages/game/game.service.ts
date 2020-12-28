import { Injectable } from '@angular/core';
import { GameApiService } from './game-api.service';

@Injectable()
export class GameService {

  constructor(
    private gameApiService: GameApiService,
  ) {

  }

  public getAnswers() {
    return this.gameApiService.getAnswers();
  }
}
