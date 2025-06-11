import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IAnswer, IGameSettings } from '../models/models';

@Injectable()
export class GameServerService {
  constructor(private socket: Socket) {}

  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  getMessage(): Observable<string> {
    return this.socket.fromEvent<string, 'message'>('message');
  }

  createGame(
    gameSettings: IGameSettings,
    callback: (gameId: string | false) => void
  ): void {
    this.socket.emit('createGame', gameSettings, callback);
  }

  joinGame(
    gameId: string,
    callback: (gameSettings: IGameSettings | null) => void
  ): void {
    this.socket.emit('joinGame', gameId, callback);
  }

  openCard(gameId: string, card: IAnswer): void {
    this.socket.emit('openCard', gameId, card);
  }

  openCard$(): Observable<IAnswer> {
    return this.socket.fromEvent<IAnswer, 'openCard'>('openCard');
  }

  changeQuestion(gameId: string, next: boolean): void {
    this.socket.emit('changeQuestion', gameId, next);
  }

  changeQuestion$(): Observable<boolean> {
    return this.socket.fromEvent<boolean, 'changeQuestion'>('changeQuestion');
  }
}
