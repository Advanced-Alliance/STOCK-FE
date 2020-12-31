import { AdminApiService } from './admin-api.service';
import { AdminService } from './admin.service';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { OpenFileDialogComponent } from './open-file-dialog/open-file-dialog.component';



@NgModule({
  declarations: [
    AdminComponent,
    OpenFileDialogComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule // Must be the last one
  ],
  providers: [
    AdminApiService,
    AdminService,
  ]
})
export class AdminModule { }
