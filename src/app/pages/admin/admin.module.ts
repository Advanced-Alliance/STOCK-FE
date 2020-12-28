import { AnswersService } from './../home/answers.service';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
  ],
  providers: [
    AnswersService,
  ]
})
export class AdminModule { }
