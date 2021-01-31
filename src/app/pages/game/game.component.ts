import { IActivePlayer, IGame, IGameSettings, ITeam } from './../../models/models';
import { GameService } from './../../services/game.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent extends BaseComponent implements OnInit {

  gameSettings?: IGameSettings;
  isAdminMode: boolean;

  stageIndex: number = 0;
  activePlayer: IActivePlayer; // TODO: change to activeTeam witch array

  //TODO:
  teamOneIcon: string = '/assets/images/red.svg';
  teamTwoIcon: string = '/assets/images/blue.svg';

  winnerTeamId: number;
  gameEnded: boolean;
  answers: any;
  title: string;
  counterTeam1: any;
  counterTeam2: any;
  placeholder: string;
  currentQuestionIdx: number;
  pointsTeam1: number;
  pointsTeam2: number;
  failsTeam1: number[];
  failsTeam2: number[];
  showAnswersMode: boolean;
  showFireworks: boolean;
  isSoundOn: boolean;
  private openedAnswers: boolean[];
  private audioFail: HTMLAudioElement;
  private audioFlip: HTMLAudioElement;
  private audioCash: HTMLAudioElement;
  private audioWin: HTMLAudioElement;

  constructor(
    private gameService: GameService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initSubs();

    this.initSounds();
  }

  private initSubs() {
    this.gameService.getGameSettings().pipe(
      this.unsubscribeOnDestroy
    ).subscribe((gs: IGameSettings) => {
      // TODO: (ShadowHD33RUS) move to gameService.getNewGame();
      gs.game.teamLeft = {
        fails: 0,
        players: [],
        points: 0,
      };
      gs.game.teamRight = {
        fails: 0,
        players: [],
        points: 0,
      };
      this.gameSettings = gs;

      this.activePlayer = {
        team: 0,
        player: 0,
      }

      console.log(this.gameSettings);

      setTimeout(() => {

        setTimeout(() => {
          this.counterTeam1 = this.createOdometer('#odometer-red');
          this.counterTeam2 = this.createOdometer('#odometer-blue');
        });

      }, 1000);
    })
  }

  /**
   * @deprecated
   */
  private init(): void {

    this.isSoundOn = true;
    this.placeholder = 'Ответ';
    this.pointsTeam1 = 0;
    this.pointsTeam2 = 0;
    this.failsTeam1 = [1, 1, 1];
    this.failsTeam2 = [1, 1, 1];
    this.showAnswersMode = false;
    this.showFireworks = false;


    this.title = 'Тхис баттл';
    this.currentQuestionIdx = 0;

  }

  setActiveTeam(id: number) {
    this.activePlayer.team = id;
  }

  // TODO: change to global
  switchSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  private createOdometer(id) {
    const trueOdometer = _.get(window, 'Odometer');
    const el = document.querySelector(id);

    const od = new trueOdometer({
      el: el,
      value: this.pointsTeam1,

      // Any option (other than auto and selector) can be passed in here
      theme: 'minimal',
      format: 'd'
    });

    return el;
  }

  // НАХРЕНА????????? TODO:remove
  getCurrentAnswer(idx) {
    return this.answers[this.currentQuestionIdx].answers[idx];
  }

  getCurrentQuestion() {
    const question = this.answers[this.currentQuestionIdx].question;
    /*const addition = `${question.indexOf('?') !== -1 ? '' : '?'}`;
    return `${this.placeholder} ${this.currentQuestionIdx + 1}: ${question}${addition}`;*/
    return `${question}`;
  }

  onSelected(id: number) {
    this.openedAnswers[id] = true;
    this.playFlipSound();
    this.playCashSound();
    if (this.showAnswersMode) {
      return;
    }
    const award = +(this.answers[this.currentQuestionIdx].answers[id].quantity);
    if (this.activePlayer.team === 1) {
      this.pointsTeam1 += award;
      this.counterTeam1.innerHTML = this.pointsTeam1;
    } else {
      this.pointsTeam2 += award;
      this.counterTeam2.innerHTML = this.pointsTeam2;
    }

    const fails = this.activePlayer.team === 1 ? this.failsTeam2 : this.failsTeam1;
    // if (this.isAnotherTeamBuffer(fails)) {
    //   // switch
    //   this.activePlayer.team = this.activePlayer.team === 1 ? 2 : 1;
    // }
  }

  nextQuestion() {
    if (this.currentQuestionIdx === this.answers.length - 1
      && (this.isNextBtnEnabled()
        //   || (this.isAnotherTeamBuffer(this.failsTeam1)
        //     && this.isAnotherTeamBuffer(this.failsTeam2)
        //   )
      )
    ) {
      this.showFireworks = true;
      this.activePlayer.team = this.pointsTeam1 > this.pointsTeam2 ? 1
        : this.pointsTeam1 === this.pointsTeam2 ? 1 : 2;
      this.gameEnded = true;
      this.winnerTeamId = this.pointsTeam1 > this.pointsTeam2 ? 1 : 2;
      this.playWinSound();
      return;
    } else if (this.currentQuestionIdx === this.answers.length - 1) {
      return;
    } else if (!this.isNextBtnEnabled()) {
      return;
    }
    this.currentQuestionIdx++;

    const game = this.gameSettings?.game;

    if (!game || !game.teamLeft || !game.teamRight) return;

    const lowerTeam = (game.teamLeft.points >= game.teamRight.points)
      ? 0 : 1;

    this.activePlayer.team = lowerTeam;
    this.showAnswersMode = false;

    game.teamLeft.fails = 0;
    game.teamRight.fails = 0;
  }

  previousQuestion() {
    if (this.currentQuestionIdx === 0) {
      return;
    }
    this.currentQuestionIdx -= 1;
  }

  private isNextBtnEnabled() {
    return _.find(this.openedAnswers, (x) => x === false) === undefined;
  }

  onFail(totalFails: number, teamId: number) {
    // (ShadowHD33RUS) i think is not needed, or need to move to settings
    // if (this.activePlayer.team !== teamId) {
    //   return;
    // }

    this.playFailSound();

    // TODO: replace with teams array;
    const currTeam = (teamId == 0)
      ? this.gameSettings?.game.teamLeft
      : this.gameSettings?.game.teamRight;

    if (!currTeam) return;

    currTeam.fails = totalFails;

    if (this.gameSettings && this.gameSettings.game.maxFails >= currTeam.fails) {
      this.showAnswersMode = false;
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
      {
        name: '.mp3',
        type: 'audio/mpeg'
      }, {
        name: '.wav',
        type: 'audio/wav'
      }, {
        name: '.ogg',
        type: 'audio/ogg'
      }];

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

}
