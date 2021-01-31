import { Router, ActivatedRoute } from '@angular/router';
import { OpenFileDialogComponent } from './open-file-dialog/open-file-dialog.component';
import { GameService } from './../../services/game.service';
import { AdminService } from './admin.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from '@angular/core';
import { IGameSettings, OrderBy, IGame, GameType, IQuestion } from './../../models/models';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends BaseComponent implements OnInit {

  gameForm: FormGroup;

  editGameName = false;

  createDate = Date.now();
  currentQuestion = 0;
  unsavedChanges = true;

  teamLeftName?: string | null;
  teamRightName?: string | null;

  get questions(): FormArray {
    return this.gameForm.controls.questions as FormArray;
  }
  readonly maxQuestions = 6;
  readonly minQuestions = 1;

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private gameService: GameService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.initNewGame();
    this.initSubs();
  }

  saveChanges(): void {
    this.unsavedChanges = false;
    this.gameService.setGameSettings(this.getChanges());
    this.gameService.getGameSettings().pipe(
      this.unsubscribeOnDestroy
    ).subscribe((gameSettings) => {
      this.adminService.downloadSettingsFile(gameSettings);
    });
  }

  /**
   *  @deprecated
   */
  loadFromFile(): void {
    const dialogRef = this.dialog.open(OpenFileDialogComponent);

    dialogRef.afterClosed()
      .subscribe((gameSettings: IGameSettings) => {
        console.log(gameSettings);
      });
  }

  onOpenFile(): void {
    const inputNode: any = document.querySelector('#fileInput');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {

        const json = e.target.result;
        const gameSettings = this.gameService.parseJSON(json);

        this.questions.clear();

        gameSettings.game.questions.forEach((q) => {
          this.questions.push(this.createQuestion(q));
        })

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
    if (
      $event.index === this.questions.length - 1
    ) {
      const currentQuestion = this.questions.controls[$event.index] as FormGroup;
      currentQuestion.controls.stageName.setValue(`Вопрос ${$event.index + 1}`);
      this.questions.push(this.getDefaultTab());
    }
  }

  onAddAnswer(questionIndex: number) {
    const answers = (this.questions.controls[questionIndex] as FormGroup).controls.answers as FormArray;
    answers.push(this.createAnswer('Новый ответ', 1));
  }

  onRemoveQuestion(index: number): void {
    if (this.questions.length <= 1) return;

    if (this.questions.length - 2 === index) {
      this.currentQuestion--;
    }

    this.questions.removeAt(index);
  }

  onRemoveAnswer(questionIndex: number, answerIndex: number): void {
    const answers = (this.questions.controls[questionIndex] as FormGroup).controls.answers as FormArray;
    if (answers.length <= 1) return;
    answers.removeAt(answerIndex);
  }

  startGame(online: boolean) {
    this.gameService.setGameSettings(this.getChanges());
    if (!online) {
      this.router.navigate(['game'], { relativeTo: this.route });
      return;
    }
    // TODO: change to real id from web server
    this.router.navigate(['/game'], { queryParams: { id: 0 } });
  }


  private initNewGame() {
    this.gameForm = this.fb.group({
      gameName: ['Новая игра', Validators.required],
      showQuestionsText: [true],
      maxFails: [3],
      gameType: [GameType.teamPlay],
      questions: this.fb.array([
        this.getDefaultTab('Простая игра'),
        this.getDefaultTab(),
      ]),
    });
  }

  private initSubs(): void {
    this.gameForm.valueChanges.pipe(
      this.unsubscribeOnDestroy
    ).subscribe(
      () => this.unsavedChanges = true
    )
  }

  private getDefaultTab(stageName?: string): FormGroup {
    if (_.isEmpty(stageName)) stageName = '+ Добавить'
    const question = this.fb.group({
      stageName: stageName,
      questionText: '',
      orderBy: OrderBy.none,
      enable: true,
      answers: this.getDefaultAnswers(),
    })
    return question;
  }

  private getDefaultAnswers(): FormArray {

    const formArrayAnswers =
      this.fb.array([
        this.createAnswer('Частый ответ', 60),
        this.createAnswer('Средний ответ', 30),
        this.createAnswer('Редкий ответ', 10),
      ]);
    return formArrayAnswers;
  }

  private createAnswer(name?: string, points?: number): FormGroup {
    return this.fb.group({
      name: this.fb.control(name),
      points: this.fb.control(points),
    })
  }

  private createQuestion(question: IQuestion): FormGroup {
    const qGroup = this.fb.group({
      stageName: [question.stageName],
      questionText: '',
      orderBy: OrderBy.none,
      enable: true,
      answers: this.fb.array(
        question.answers.map(
          (a) => this.createAnswer(a.name, a.points)
        )
      ),
    });

    qGroup.patchValue(question);
    return qGroup;
  }

  private getChanges(): IGameSettings {
    const gameData = this.gameForm.value as IGame;
    gameData.questions = gameData.questions.slice(0, this.questions.length - 1)



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
      game: gameData

    };
    return editorData;
  }

}
