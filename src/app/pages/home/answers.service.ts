import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AnswersService {
  public round: number;
  private apiUrl: string;
  private saveUrl: string;
  private file: string;
  private method: string;
  private httpOptions: any;

  constructor(private http: HttpClient) {
    this.http.get('/assets/answers/config.json').subscribe(configAPI => {
      this.apiUrl = configAPI['apiUrl'];
      this.saveUrl = configAPI['saveUrl'];
      this.file = configAPI['file'];
      this.method = configAPI['method'];
    });
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }

  public getAnswers() {
    if (this.method === 'server') {
      return this.http.get(this.apiUrl + '?round=' + this.round);
    } else {
      return this.http.get(this.apiUrl + '/' + this.file + '?round=' + this.round);
    }
  }

  public saveQuestions(questions: any) {
    return this.http.post(this.saveUrl, questions, this.httpOptions);
  }
}
