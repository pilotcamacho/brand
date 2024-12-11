import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';


import {
  provideCharts,
  withDefaultRegisterables,
  } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AmplifyAuthenticatorModule],
  providers: [provideCharts(withDefaultRegisterables()), { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
