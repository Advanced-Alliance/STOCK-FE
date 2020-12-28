import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SUFFIX } from './../../core/core.consts';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  readonly CONTENT_TYPE_JSON = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  saveQuestions(questions: any) {
    return this.http.post(`${API_SUFFIX}/game`, questions, this.CONTENT_TYPE_JSON);
  }

  getAnswers(): Observable<Object> {
    return this.http.get(
      `${API_SUFFIX}/game`,
    );
  }
}
