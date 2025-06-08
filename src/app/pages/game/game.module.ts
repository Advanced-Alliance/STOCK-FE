import { NgModule } from '@angular/core';

import { GameComponent } from './game.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: GameComponent }];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: []
})
export class GameModule { }
