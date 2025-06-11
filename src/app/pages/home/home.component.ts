import { BaseComponent } from './../../core/base.component';

import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { GameServerService } from '../../services/game-server.service';
import { IGameSettings } from '../../models/models';
import { GameSettingService } from '../../services/game-setting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    MatAnchor,
    RouterLink,
    MatTooltip,
  ],
})
export class HomeComponent extends BaseComponent implements OnInit {
  gameFrom = new UntypedFormGroup({
    gameId: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(/^(\d|[A-Z]){4}$/),
    ]),
  });
  gameAvalable = false;

  constructor(
    private gameServerService: GameServerService,
    private gameSettingService: GameSettingService,

    private router: Router
  ) {
    super();
  }

  joinGameCallback = (gameSettings: IGameSettings | null) => {
    console.log(`Success: ${this.router}`);

    if (!gameSettings) return;

    this.gameSettingService.setGameSettings(gameSettings);
    this.router.navigate(['/game']);
  };

  ngOnInit() {}

  play(): void {
    this.gameServerService.joinGame(
      this.gameFrom.controls['gameId'].value,
      this.joinGameCallback
    );
  }
}
