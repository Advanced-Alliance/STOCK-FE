import { BaseComponent } from './../../core/base.component';

import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {



  constructor(
  ) {
    super();
  }

  ngOnInit() {
  }

}
