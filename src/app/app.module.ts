import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AnswerCardComponent } from './answer-card/answer-card.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { AnswersService } from './answers.service';
import { AdminComponent } from './pages/admin/admin.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    AnswerCardComponent,
    IndicatorComponent,
  ],
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    AnswersService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
