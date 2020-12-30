import { AdminService } from './admin.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from "@angular/core";
import { IEditor, OrderBy } from './../../models/models';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent extends BaseComponent implements OnInit {

  editorConfiguration: IEditor;

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.initNewGame();
  }

  private initNewGame() {
    this.editorConfiguration = {
      createDate: Date.now(),
      lastEditQuestion: 0,
      gameSettings: {
        commonPoints: 0,
        currentStage: 0,
        showQuestionsText: true,
        teamLeft: {
          points: 0,
        },
        teamRight: {
          points: 0,
        },
        questions: [{
          stageName: 'Простая игра',
          orderBy: OrderBy.none,
          answers: [
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
        }],
      }
    }
  }

  saveChanges() {

  }

}
