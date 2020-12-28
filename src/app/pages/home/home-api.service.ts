import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SUFFIX } from '../../core/core.consts';

@Injectable()
export class HomeApiService {

  constructor(
    private http: HttpClient
  ) {

  }

  public getAnswers() {
    return this.http.get(`${API_SUFFIX}/game`);
  }
}
