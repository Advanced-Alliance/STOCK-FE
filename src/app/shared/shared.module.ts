import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const MATERIAL = [
  MatButtonModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...MATERIAL,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
  ],
  exports: [
    ...MATERIAL,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
  ]
})
export class SharedModule { }
