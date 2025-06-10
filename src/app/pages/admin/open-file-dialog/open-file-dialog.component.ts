import { GameSettingService } from '../../../services/game-setting.service';
import { IGameSettings } from './../../../models/models';
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-open-file-dialog',
  templateUrl: './open-file-dialog.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
  ],
})
export class OpenFileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OpenFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGameSettings,
    private gameService: GameSettingService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDropFile(): void {
    this.dialogRef.close(this.gameService.parseJSON('{}'));
  }
}
