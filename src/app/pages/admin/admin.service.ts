import { IGameSettings } from './../../models/models';
import { Observable } from 'rxjs';
import { AdminApiService } from './admin-api.service';
import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private adminApiService: AdminApiService,
    private fileSaverService: FileSaverService,
  ) { }

  public saveQuestions(questions: any) {
    return this.adminApiService.saveQuestions(questions);
  }

  getAnswers(): Observable<Object> {
    return this.adminApiService.getAnswers();
  }

  downloadSettingsFile(gameSettings: IGameSettings): void {
    const fileSettingsBlob = new Blob(
      [JSON.stringify(gameSettings)],
      { type: 'application/json' }
    );
    const filename = `${gameSettings.game.name || 'STOCK Game Settings'}.json`;
    this.fileSaverService.save(fileSettingsBlob, filename);
  }
}
