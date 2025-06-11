import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameSettingService } from './services/game-setting.service';
import { GameServerService } from './services/game-server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
  providers: [GameSettingService, GameServerService],
})
export class AppComponent implements OnInit {
  constructor(private gameServerService: GameServerService) {}

  ngOnInit(): void {
    this.gameServerService.getMessage().subscribe((msg) => {
      console.log(msg);

    });
  }
}
