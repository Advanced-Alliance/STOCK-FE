import { BaseComponent } from './../../core/base.component';

import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  gameFrom = new FormGroup({
    gameId: new FormControl('', [
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
    this.gameFrom.disable();
  }

  play(){
    alert('You cannot to play yet');
  }

}
