import { IGameSettings } from './../../models/models';
import { Observable } from 'rxjs';
import { AdminApiService } from './admin-api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private adminApiService: AdminApiService,
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
    const url = window.URL.createObjectURL(fileSettingsBlob);
    const filename = 'STOCK game settings.json';
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
