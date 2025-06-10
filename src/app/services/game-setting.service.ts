import { Observable, of } from 'rxjs';
import { IGameSettings } from '../models/models';
import { Injectable } from "@angular/core";

@Injectable()
export class GameSettingService {
  private gameSettings: IGameSettings;

  // TODO: add error msg
  getGameSettings(): Observable<IGameSettings | null> {
    return of(this.gameSettings);
  }

  setGameSettings(gameSettings: IGameSettings): void {
    this.gameSettings = gameSettings;
  }

  parseJSON(json: string): IGameSettings {
    const resGameSettings = JSON.parse(json);
    return resGameSettings;
  }
}
