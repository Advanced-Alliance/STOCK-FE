import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameSettingService } from './services/game-setting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
  providers: [GameSettingService],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
