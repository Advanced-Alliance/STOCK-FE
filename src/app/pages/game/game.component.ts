import { IActivePlayer, IGameSettings, TeamTypes } from './../../models/models';
import { GameSettingService } from '../../services/game-setting.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

import { CardComponent } from './answers/card/card.component';
import { MatButton } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { TeamComponent } from './team/team.component';
import { AnswersComponent } from './answers/answers.component';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [GameService],
  imports: [TeamComponent, AnswersComponent, MatButton, AnswersComponent],
})
export class GameComponent extends BaseComponent implements OnInit {
  gameSettings?: IGameSettings;
  isAdminMode: boolean = false;
  gameEnded: boolean = false;
  showAnswersMode: boolean = false;

  bank = 0;

  stageIndex: number = 0;
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
  private openedAnswers: boolean[];
  private audioFail: HTMLAudioElement;
  private audioFlip: HTMLAudioElement;
  private audioCash: HTMLAudioElement;
  private audioWin: HTMLAudioElement;

  constructor(
    private gameSettingService: GameSettingService,
    private gameService: GameService,
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
      });
  }

  /**
   * @deprecated
   */
  private init(): void {
    this.isSoundOn = true;
    this.placeholder = 'Ответ';
  }

  setActiveTeam(team: TeamTypes) {
    this.activePlayer.team = team;
  }

  // TODO: change to global
  switchSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  // НАХРЕНА????????? TODO:remove
  getCurrentAnswer(idx) {
    return this.answers[this.stageIndex].answers[idx];
  }

  getCurrentQuestion() {
    const question = this.answers[this.stageIndex].question;
    /*const addition = `${question.indexOf('?') !== -1 ? '' : '?'}`;
    return `${this.placeholder} ${this.stageIndex + 1}: ${question}${addition}`;*/
    return `${question}`;
  }

  onSelected(id: number) {
    const game = this.gameSettings?.game;
    if (!game) return;

    const answer = game.questions[this.stageIndex].answers[id];

    if (answer.opened) return;
    answer.opened = true;

    this.gameService.answerInstant$.next(answer);

    const award = answer.points || 0;

    if (!this.activePlayer) return;

    game[this.activePlayer.team].points += award;
    // this.counters[this.activePlayer.team || 0].innerHTML = currentTeam.points;

    this.activePlayer.team =
      this.activePlayer.team == 'teamLeft' ? 'teamRight' : 'teamLeft';

    if (this.showAnswersMode) return;

    this.playFlipSound();
  }

  nextQuestion() {
    if (!this.gameSettings) return;

    if (this.stageIndex === this.gameSettings.game.questions.length - 1) {
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
    if (this.stageIndex === 0) {
      return;
    }
    this.stageIndex -= 1;
  }

  onFail(team: TeamTypes) {
    // (ShadowHD33RUS) i think is not needed, or need to move to settings
    // if (this.activePlayer.team !== teamId) {
    //   return;
    // }

    this.playFailSound();

    if (!this.gameSettings || this.showAnswersMode) return;

    // TODO: replace with teams array;
    this.gameSettings.game[team].fails++;

    if (this.gameSettings.game.maxFails <= this.gameSettings.game[team].fails) {
      this.showAnswersMode = true;
    }
  }

  private nextRound() {
    this.stageIndex++;

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
    const answers = this.gameSettings?.game.questions[this.stageIndex].answers;
    if (!this.gameSettings) return;
    if (!answers) return;
    for (const { id } of this.gameSettings.game.questions[this.stageIndex]
      .answers) {
      this.gameService.answerInstant$.next({ id, opened: false });
    }
  }

  private playFailSound() {
    if (this.isSoundOn) {
      this.audioFail.play();
    }
  }

  private playFlipSound() {
    if (this.isSoundOn) {
      this.audioFlip.play();
    }
  }

  private playCashSound() {
    if (this.isSoundOn) {
      this.audioCash.play();
    }
  }

  private playWinSound() {
    if (this.isSoundOn) {
      this.audioWin.play();
    }
  }

  private loadAudio(fileName) {
    const audio = new Audio();
    audio.controls = true;
    const audioFormats = [
      // {
      //   name: '.mp3',
      //   type: 'audio/mpeg',
      // },
      {
        name: '.wav',
        type: 'audio/wav',
      },
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
