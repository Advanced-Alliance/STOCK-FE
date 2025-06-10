import { IActivePlayer, IGameSettings, TeamTypes } from './../../models/models';
import { GameService } from './../../services/game.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

import { AnswerCardComponent } from './answer-card/answer-card.component';
import { MatButton } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { TeamComponent } from './team/team.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [TeamComponent, AnswerCardComponent, MatButton],
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
    this.gameService
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
    // this.openedAnswers[id] = true;
    this.playFlipSound();
    // this.playCashSound();
    if (this.showAnswersMode) return;

    const game = this.gameSettings?.game;
    if (!game) return;

    const award = game.questions[this.stageIndex].answers[id].points;
    // const currentTeam =
      // this.activePlayer.team == 0 ? game.teamLeft : game.teamRight;
    if (!this.activePlayer) return;

    game[this.activePlayer.team].points += award;
    // this.counters[this.activePlayer.team || 0].innerHTML = currentTeam.points;

    this.activePlayer.team = this.activePlayer.team == 'teamLeft' ? 'teamRight' : 'teamLeft';
  }

  nextQuestion() {
    if (!this.gameSettings) return;

    if (this.stageIndex === this.gameSettings.game.questions.length - 1) {
      this.endgame();
      return;
    }
    this.nextRound();
  }

  previousQuestion() {
    if (this.stageIndex === 0) {
      return;
    }
    this.stageIndex -= 1;
  }

  onFail(totalFails: number, teamId: number) {
    // (ShadowHD33RUS) i think is not needed, or need to move to settings
    // if (this.activePlayer.team !== teamId) {
    //   return;
    // }

    this.playFailSound();

    // TODO: replace with teams array;
    const currTeam =
      teamId == 0
        ? this.gameSettings?.game.teamLeft
        : this.gameSettings?.game.teamRight;

    if (!currTeam) return;

    currTeam.fails = totalFails;

    if (
      this.gameSettings &&
      this.gameSettings.game.maxFails >= currTeam.fails
    ) {
      this.showAnswersMode = true;
    }
  }

  private nextRound() {
    this.stageIndex++;

    const game = this.gameSettings?.game;

    if (!game || !game.teamLeft || !game.teamRight) return;

    const lowerTeam = game.teamLeft.points <= game.teamRight.points ? 'teamLeft' : 'teamRight';

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

    this.activePlayer.team = teamLeftPoints > teamRightPoints ? 'teamLeft' : 'teamRight';
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
