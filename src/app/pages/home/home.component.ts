import { BaseComponent } from './../../core/base.component';

import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  gameFrom = new UntypedFormGroup({
    gameId: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(/^(\d){4}$/)
    ]),
  });
  gameAvalable = false;

  constructor(
  ) {
    super();
  }

  ngOnInit() {
  }

  play(){
    alert('You cannot to play yet');
  }

}
