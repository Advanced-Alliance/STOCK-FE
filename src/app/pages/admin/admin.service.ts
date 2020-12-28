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
}
