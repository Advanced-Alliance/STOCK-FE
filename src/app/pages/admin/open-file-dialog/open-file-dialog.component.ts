import { GameService } from './../../../services/game.service';
import { IGameSettings } from './../../../models/models';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-open-file-dialog',
  templateUrl: './open-file-dialog.component.html',
})
export class OpenFileDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OpenFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGameSettings,
    private gameService: GameService,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDropFile(): void {
    this.dialogRef.close(this.gameService.parseJSON('{}'));
  }

}
