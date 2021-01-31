import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: AdminComponent, pathMatch: 'full' },
  {
    path: 'game',
    data: {
      admin: true,
    },
    loadChildren: () => import('../game/game.module').then(m => m.GameModule)
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
