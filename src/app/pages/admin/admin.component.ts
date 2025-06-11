import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { OpenFileDialogComponent } from './open-file-dialog/open-file-dialog.component';
import { GameSettingService } from '../../services/game-setting.service';
import { AdminService } from './admin.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from '@angular/core';
import {
  IGameSettings,
  OrderBy,
  IGame,
  GameType,
  IQuestion,
} from './../../models/models';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  UntypedFormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import * as _ from 'lodash';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { GameServerService } from '../../services/game-server.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatFormField,
    MatInput,
    MatTabGroup,
    MatTab,
    MatLabel,
    MatButton,
  ],
})
export class AdminComponent extends BaseComponent implements OnInit {
  gameForm: UntypedFormGroup;

  editGameName = false;

  createDate = Date.now();
  currentQuestion = 0;
  unsavedChanges = true;

  teamLeftName?: string | null;
  teamRightName?: string | null;

  get questions(): UntypedFormArray {
    return this.gameForm.controls.questions as UntypedFormArray;
  }
  readonly maxQuestions = 6;
  readonly minQuestions = 1;

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private gameSettingService: GameSettingService,
    private gameServerService: GameServerService,

    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.initNewGame();
    this.initSubs();
  }

  saveChanges(): void {
    this.unsavedChanges = false;
    this.gameSettingService.setGameSettings(this.getChanges());
    this.gameSettingService
      .getGameSettings()
      .pipe(this.unsubscribeOnDestroy)
      .subscribe((gameSettings) => {
        this.adminService.downloadSettingsFile(gameSettings);
      });
  }

  /**
   *  @deprecated
   */
  loadFromFile(): void {
    const dialogRef = this.dialog.open(OpenFileDialogComponent);

    dialogRef.afterClosed().subscribe((gameSettings: IGameSettings) => {
      console.log(gameSettings);
    });
  }

  onOpenFile(): void {
    const inputNode: any = document.querySelector('#fileInput');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const json = e.target.result;
        const gameSettings = this.gameSettingService.parseJSON(json);

        this.questions.clear();

        gameSettings.game.questions.forEach((q) => {
          this.questions.push(this.createQuestion(q));
        });

        this.questions.push(this.getDefaultTab());

        this.gameForm.patchValue(gameSettings.game, { emitEvent: false });

        this.unsavedChanges = false;
        this.createDate = gameSettings.createDate;
        this.currentQuestion = gameSettings.lastEditQuestion;
      };

      reader.readAsText(inputNode.files[0]);
    }
  }

  onSelectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index === this.questions.length - 1) {
      const currentQuestion = this.questions.controls[
        $event.index
      ] as UntypedFormGroup;
      currentQuestion.controls.stageName.setValue(`Вопрос ${$event.index + 1}`);
      this.questions.push(this.getDefaultTab());
    }
  }

  onAddAnswer(questionIndex: number) {
    const answers = (this.questions.controls[questionIndex] as UntypedFormGroup)
      .controls.answers as UntypedFormArray;
    answers.push(this.createAnswer(answers.length, 'Новый ответ', 1));
  }

  onRemoveQuestion(index: number): void {
    if (this.questions.length <= 1) return;

    if (this.questions.length - 2 === index) {
      this.currentQuestion--;
    }

    this.questions.removeAt(index);
  }

  onRemoveAnswer(questionIndex: number, answerIndex: number): void {
    const answers = (this.questions.controls[questionIndex] as UntypedFormGroup)
      .controls.answers as UntypedFormArray;
    if (answers.length <= 1) return;
    answers.removeAt(answerIndex);
  }

  startGame(online: boolean): void {
    const newGameSettings = this.getChanges();
    if (online) {
      const callback = (onlineId: string | false) => {
        if (onlineId)
          this.gameSettingService.setGameSettings({
            ...newGameSettings,
            onlineId,
          });
        this.router.navigate(['game'], { relativeTo: this.route });
      };
      return this.gameServerService.createGame(newGameSettings, callback);
    }
    this.gameSettingService.setGameSettings(newGameSettings);
    this.router.navigate(['game'], { relativeTo: this.route });
    return;
  }

  private initNewGame() {
    this.gameForm = this.fb.group({
      name: ['Новая игра', Validators.required],
      showQuestionsText: [true],
      maxFails: [3],
      gameType: [GameType.Classic],
      questions: this.fb.array([
        this.getDefaultTab('Простая игра'),
        this.getDefaultTab('Двойная игра'),
        this.getDefaultTab(),
      ]),
    });
  }

  private initSubs(): void {
    this.gameForm.valueChanges
      .pipe(this.unsubscribeOnDestroy)
      .subscribe(() => (this.unsavedChanges = true));
  }

  private getDefaultTab(stageName?: string): UntypedFormGroup {
    if (_.isEmpty(stageName)) stageName = '+ Добавить';
    const question = this.fb.group({
      stageName: stageName,
      questionText: '',
      orderBy: OrderBy.none,
      enable: true,
      answers: this.getDefaultAnswers(),
    });
    return question;
  }

  private getDefaultAnswers(): UntypedFormArray {
    const formArrayAnswers = this.fb.array([
      this.createAnswer(0, 'Частый ответ', 60),
      this.createAnswer(1, 'Средний ответ', 30),
      this.createAnswer(2, 'Редкий ответ', 10),
    ]);
    return formArrayAnswers;
  }

  private createAnswer(
    id: number,
    name?: string,
    points?: number
  ): UntypedFormGroup {
    return this.fb.group({
      id: this.fb.control(id),
      text: this.fb.control(name),
      points: this.fb.control(points),
    });
  }

  private createQuestion(question: IQuestion): UntypedFormGroup {
    const qGroup = this.fb.group({
      stageName: [question.stageName],
      questionText: '',
      orderBy: OrderBy.none,
      enable: true,
      answers: this.fb.array(
        question.answers.map((a, i) => this.createAnswer(i, a.text, a.points))
      ),
    });

    qGroup.patchValue(question);
    return qGroup;
  }

  private getChanges(): IGameSettings {
    const gameData = this.gameForm.value as IGame;
    gameData.questions = gameData.questions.slice(0, this.questions.length - 1);

    //   commonPoints: 0,
    //   currentStage: 0,
    //   showQuestionsText: true,
    //   players: [],
    //   gameType: GameType.teamPlay,
    //   teamLeft: {
    //     name: this.teamLeftName,
    //     points: 0,
    //     fails: 0,
    //     players: [],
    //   },
    //   teamRight: {
    //     name: this.teamRightName,
    //     points: 0,
    //     fails: 0,
    //     players: [],
    //   },
    //   questions: questions,
    // }

    const editorData: IGameSettings = {
      createDate: this.createDate,
      lastEditQuestion: this.currentQuestion,
      lastEditDate: Date.now(),
      game: gameData,
    };
    return editorData;
  }
}
