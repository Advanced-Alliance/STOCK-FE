import { Injectable } from '@angular/core';
import { HomeApiService } from './home-api.service';

@Injectable()
export class homeService {

  constructor(
    private homeApiService: HomeApiService,
  ) {

  }

  public getAnswers() {
    return this.homeApiService.getAnswers();
  }
}
