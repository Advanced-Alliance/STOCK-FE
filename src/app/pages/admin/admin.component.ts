import { AdminService } from './admin.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent extends BaseComponent implements OnInit {
  questions: any;

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.adminService.getAnswers().pipe(
      this.unsubsribeOnDestroy
    ).subscribe((res) => {
      this.questions = res;
    });
  }

  public saveChanges() {
    this.adminService.saveQuestions(this.questions).pipe(
      this.unsubsribeOnDestroy
    ).subscribe((res) => {

    });
  }
}
