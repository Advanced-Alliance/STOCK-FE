import {
  GameType,
  IActivePlayer,
  IAnswer,
  IGameSettings,
  TeamTypes,
} from './../../models/models';
import { GameSettingService } from '../../services/game-setting.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Observable, of } from 'rxjs';
import { TeamComponent } from './team/team.component';
import { AnswersComponent } from './answers/answers.component';
import { GameService } from './game.service';
import { GameServerService } from '../../services/game-server.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [GameService],
  imports: [
    TeamComponent,
    AnswersComponent,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatCheckbox,
    AnswersComponent,
  ],
})
export class GameComponent extends BaseComponent implements OnInit {
  readonly GameType = GameType;
  gameSettings?: IGameSettings;
  isAdminMode = false;
  gameEnded = false;
  showAnswersMode = false;
  isOnline = false;

  bank = 0;

  currentStage: number = 0;
  activePlayer: IActivePlayer; // TODO: change to activeTeam witch array
  counters: any[] = []; // TODO: move to HTML Element type

  //TODO:
  teamOneIcon: string = '/assets/images/red.svg';
  teamTwoIcon: string = '/assets/images/blue.svg';

  answers: any;
  title: string;
  placeholder: string;
  currentQuestionIdx: number;
  isSoundOn = true;
  private audioFail: HTMLAudioElement;
  private audioFlip: HTMLAudioElement;
  private audioCash: HTMLAudioElement;
  private audioWin: HTMLAudioElement;

  constructor(
    private gameSettingService: GameSettingService,
    private gameService: GameService,
    private gameServerService: GameServerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.initSubs();

    this.initSounds();
  }

  private initSubs() {
    this.gameSettingService
      .getGameSettings()
      .pipe(this.unsubscribeOnDestroy)
      .subscribe((gameSettings: IGameSettings | null) => {
        console.log(gameSettings);

        if (!gameSettings) {
          this.router.navigate(['/']);
          return;
        }
        // TODO: move to gameService.getNewGame();
        gameSettings.game.teamLeft = {
          fails: 0,
          players: [],
          points: 0,
        };
        gameSettings.game.teamRight = {
          fails: 0,
          players: [],
          points: 0,
        };
        this.gameSettings = gameSettings;

        this.activePlayer = {
          team: 'teamLeft',
          player: 0,
        };

        if ('admin' in this.route.snapshot.data) {
          this.isAdminMode = this.route.snapshot.data['admin'];
        }

        if (gameSettings.onlineId) {
          this.isOnline = true;
          this.onlineSubs();
        }
      });
  }

  private onlineSubs(): void {
    if (this.isAdminMode) return;

    this.gameServerService
      .openCard$()
      .pipe(this.unsubscribeOnDestroy)
      .subscribe((answer) => {
        console.log('got answer', answer);

        this.gameService.answerInstant$.next(answer);

        this.playFlipSound();
      });

    this.gameServerService
      .changeQuestion$()
      .pipe(this.unsubscribeOnDestroy)
      .subscribe((next) => {
        console.log('changed question, next:', next);

        next ? this.nextQuestion() : this.previousQuestion();
      });

    this.gameServerService
      .setFail$()
      .pipe(this.unsubscribeOnDestroy)
      .subscribe((team) => {
        console.log('Team failed:', team);

        this.onFail(team);
      });

    this.gameServerService
      .changeTeam$()
      .pipe(this.unsubscribeOnDestroy)
      .subscribe((team) => {
        console.log('Force changed team:', team);

        this.setActiveTeam(team);
      });

    this.gameServerService
      .changePoints$()
      .pipe(this.unsubscribeOnDestroy)
      .subscribe(([team, points]) => {
        console.log('Force changed points:', team, points);

        const selectedTeam = this.gameSettings?.game[team];
        if (selectedTeam) {
          selectedTeam.points = points;
        }
      });
  }

  /**
   * @deprecated
   */
  private init(): void {
    this.isSoundOn = true;
    this.placeholder = 'Ответ';
  }

  setTeamPoints(team: TeamTypes, points: number | string): void {
    points = Number(points);

    this.gameServerService.changePoints(
      this.gameSettings?.onlineId || '',
      team,
      points
    );

    if (this.gameSettings) this.gameSettings.game[team].points = points;
  }

  setActiveTeam(team: TeamTypes) {
    if (!this.gameSettings) return;
    // if (this.isOnline) {
    //   this.gameServerService.changeTeam(this.gameSettings.onlineId || '', team);
    // }
    this.activePlayer.team = team;
  }

  // TODO: change to global
  switchSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  onSelected(id: number) {
    const game = this.gameSettings?.game;
    if (!game) return;

    const answer = game.questions[this.currentStage].answers[id];

    if (answer.opened) return;
    answer.opened = true;

    if (this.isAdminMode && this.isOnline) {
      return this.onSelectedAdmin(answer);
    }

    if (this.isOnline) return;

    this.gameService.answerInstant$.next(answer);

    const award = answer.points || 0;

    if (!this.activePlayer) return;

    // this.setTeamPoints(this.activePlayer.team, award);
    game[this.activePlayer.team].points += award;
    // this.counters[this.activePlayer.team || 0].innerHTML = currentTeam.points;

    this.activePlayer.team =
      this.activePlayer.team == 'teamLeft' ? 'teamRight' : 'teamLeft';

    // if (this.showAnswersMode) return;

    this.playFlipSound();
  }

  private onSelectedAdmin(answer: IAnswer): void {
    this.gameService.answerInstant$.next(answer);

    const delay = 1500;

    setTimeout(() => {
      this.gameServerService.openCard(
        this.gameSettings?.onlineId || '',
        answer
      );
    }, delay);

    const team = this.activePlayer.team;

    if (
      !this.showAnswersMode &&
      this.gameSettings &&
      this.gameSettings.game[team].fails < this.gameSettings.game.maxFails
    ) {
      const points = this.gameSettings.game[team].points + (answer.points || 0);

      if (team) {
        const game = this.gameSettings?.game;
        if (!game) return;
        if (!this.activePlayer) return;

        game[team].points = points;
      }

      setTimeout(() => {
        this.gameServerService.changePoints(
          this.gameSettings?.onlineId || '',
          team,
          points
        );
      }, delay);
    }

    this.activePlayer.team =
      this.activePlayer.team === 'teamLeft' ? 'teamRight' : 'teamLeft';

    setTimeout(() => {
      !this.showAnswersMode &&
        this.gameServerService.changeTeam(
          this.gameSettings?.onlineId || '',
          this.activePlayer.team
        );
    }, delay);
  }

  nextQuestion() {
    if (!this.gameSettings) return;

    if (this.isOnline) {
      this.gameServerService.changeQuestion(
        this.gameSettings.onlineId || '',
        true
      );
    }

    if (this.currentStage === this.gameSettings.game.questions.length - 1) {
      this.endgame();
      return;
    }
    this.closeAnswersAll();
    this.nextRound();
  }

  closeall(): void {
    this.closeAnswersAll();
  }

  previousQuestion() {
    if (!this.gameSettings) return;
    if (this.isOnline) {
      this.gameServerService.changeQuestion(
        this.gameSettings.onlineId || '',
        false
      );
    }

    if (this.currentStage === 0) {
      return;
    }
    this.currentStage -= 1;

    this.gameSettings.game.questions[this.currentStage].answers.forEach(
      (answer) => {
        this.gameService.answerInstant$.next(answer);
      }
    );
  }

  onFail(team: TeamTypes) {
    if (!this.gameSettings) return;
    if (this.isOnline) {
      const delay = 1500;
      const id = this.gameSettings.onlineId || '';
      setTimeout(() => {
        this.gameServerService.setFail(id, team);
      }, delay);
    }

    this.playFailSound();

    if (!this.gameSettings || this.showAnswersMode) return;

    // TODO: replace with teams array;

    if (this.gameSettings.game[team].fails <= this.gameSettings.game.maxFails) {
      this.gameSettings.game[team].fails++;
    }
  }

  private nextRound() {
    this.currentStage++;

    const game = this.gameSettings?.game;

    if (!game || !game.teamLeft || !game.teamRight) return;

    const lowerTeam =
      game.teamLeft.points <= game.teamRight.points ? 'teamLeft' : 'teamRight';

    this.activePlayer.team = lowerTeam;
    this.showAnswersMode = false;

    game.teamLeft.fails = 0;
    game.teamRight.fails = 0;
  }

  private endgame() {
    this.gameEnded = true;
    this.playWinSound();

    const teamLeftPoints = this.gameSettings?.game.teamLeft?.points;
    const teamRightPoints = this.gameSettings?.game.teamRight?.points;

    if (!teamLeftPoints || !teamRightPoints) return;

    this.activePlayer.team =
      teamLeftPoints > teamRightPoints ? 'teamLeft' : 'teamRight';
  }

  private closeAnswersAll(): void {
    const answers = this.gameSettings?.game.questions[this.currentStage].answers;
    if (!this.gameSettings) return;
    if (!answers) return;
    for (const { id } of this.gameSettings.game.questions[this.currentStage]
      .answers) {
      this.gameService.answerInstant$.next({ id, opened: false });
    }
  }

  private playFailSound() {
    if (this.isSoundOn && !(this.isAdminMode && this.isOnline)) {
      this.audioFail.play();
    }
  }

  private playFlipSound() {
    if (this.isSoundOn && !(this.isAdminMode && this.isOnline)) {
      this.audioFlip.play();
    }
  }

  private playCashSound() {
    if (this.isSoundOn && !(this.isAdminMode && this.isOnline)) {
      this.audioCash.play();
    }
  }

  private playWinSound() {
    if (this.isSoundOn && !(this.isAdminMode && this.isOnline)) {
      this.audioWin.play();
    }
  }

  private loadAudio(fileName) {
    const audio = new Audio();
    audio.controls = true;
    const audioFormats = [
      {
        name: '.mp3',
        type: 'audio/mpeg',
      },
      // {
      //   name: '.wav',
      //   type: 'audio/wav',
      // },
      // {
      //   name: '.ogg',
      //   type: 'audio/ogg',
      // },
    ];

    audioFormats.forEach(function (format) {
      const source = document.createElement('source');
      source.src = '/assets/sounds/' + fileName + format.name;
      source.type = format.type;
      audio.appendChild(source);
    });
    audio.load();

    return audio;
  }

  private initSounds() {
    this.audioFail = this.loadAudio('fail');

    this.audioFlip = this.loadAudio('turn');

    this.audioCash = this.loadAudio('cash');

    this.audioWin = this.loadAudio('win');
  }

  private storage(
    gameSettings: IGameSettings | null
  ): Observable<IGameSettings | null> {
    const storageName = 'gameSettings';

    if (gameSettings) {
      window.localStorage.setItem(storageName, JSON.stringify(gameSettings));
      return of(gameSettings);
    }

    const gameString = window.localStorage.getItem(storageName);

    if (gameString) return JSON.parse(gameString);

    return of(null);
  }
}
