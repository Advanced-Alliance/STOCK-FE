import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable } from 'rxjs';

@Injectable()
export class GameServerService {
  constructor(private socket: Socket) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message');
  }

  joinGame(gameId: string, callback: (value: string) => void): void {
    this.socket.emit('joinGame', gameId, callback);
  }
}
