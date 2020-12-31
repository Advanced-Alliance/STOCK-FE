import { AdminService } from './admin.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from "@angular/core";
import { IEditor, OrderBy, IQuestion, IAnswer } from './../../models/models';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent extends BaseComponent implements OnInit {

  createDate = Date.now();
  currentQuestion = 0;
  showQuestionsText = true;

  teamLeftName?: string | null;
  teamRightName?: string | null;

  questions: IQuestion[] = [];
  questionsCount: 1;

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.initNewGame();
  }

  private initNewGame() {
    this.questions = [
      {
        stageName: 'Простая игра',
        orderBy: OrderBy.none,
        enable: true,
        answers: [...this.getDefaultAnswers()],
      },
      this.getAddTab(),
    ];
  }

  private getAddTab(): IQuestion {

    const question = {
      stageName: '+ Добавить',
      orderBy: OrderBy.none,
      enable: true,
      answers: [...this.getDefaultAnswers()],
    };
    return question;
  }


  private getDefaultAnswers(): IAnswer[] {
    const answers = [
      {
        name: 'Частый ответ',
        points: 60,
      },
      {
        name: 'Средний ответ',
        points: 30,
      },
      {
        name: 'Редкий ответ',
        points: 10,
      },
    ]
    return answers;
  }

  private getChanges(): IEditor {
    const questions = this.questions;
    if (this.questions.length === this.questionsCount) {
      delete questions[this.questionsCount];
    }

    const editorData = {
      createDate: this.createDate,
      lastEditQuestion: this.currentQuestion,
      gameSettings: {
        commonPoints: 0,
        currentStage: 0,
        showQuestionsText: this.showQuestionsText,
        teamLeft: {
          name: this.teamLeftName,
          points: 0,
        },
        teamRight: {
          name: this.teamRightName,
          points: 0,
        },
        questions: questions,
      }
    };
    return editorData;
  }

  saveChanges() {
    console.log(this.getChanges());
  }

}
