import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable } from 'rxjs';
import { IGameSettings } from '../models/models';

@Injectable()
export class GameServerService {
  constructor(private socket: Socket) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message');
  }

  createGame(gameSettings: IGameSettings, callback: (gameId: string | false) => void): void {
    this.socket.emit('createGame', gameSettings, callback);
  }

  joinGame(gameId: string, callback: (gameSettings: IGameSettings | null) => void): void {
    this.socket.emit('joinGame', gameId, callback);
  }
}
