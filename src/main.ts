import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { CoreModule } from './app/core/core.module';
import { SharedModule } from './app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

let websocketUrl = 'http://localhost:8080';

if (environment.production) {
  websocketUrl = '';
  enableProdMode();
}

const config: SocketIoConfig = { url: websocketUrl, options: {} };

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      CoreModule,
      SharedModule,
      RouterModule,
      SocketIoModule.forRoot(config),
      AppRoutingModule // Must be the last one
    ),
  ],
}).catch((err) => console.log(err));
