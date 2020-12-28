import { BaseComponent } from './../../core/base.component';
import { AnswersService } from './../home/answers.service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent extends BaseComponent implements OnInit {
  questions: any;

  constructor(private answersService: AnswersService) {
    super();
  }

  ngOnInit() {
    this.answersService.getAnswers().pipe(
      this.unsubsribeOnDestroy
    ).subscribe((res) => {
      this.questions = res;
    });
  }

  public saveChanges() {
    this.answersService.saveQuestions(this.questions).pipe(
      this.unsubsribeOnDestroy
    ).subscribe((res) => {

    });
  }
}
