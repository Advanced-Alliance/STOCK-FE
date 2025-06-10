import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IAnswer } from '../../models/models';

@Injectable()
export class GameService {
  answerInstant$ = new Subject<IAnswer>();

  constructor() {}
}
