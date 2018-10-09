import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material';
import {MainRouterModule} from './main-router.module';
import {HttpClientModule} from '@angular/common/http';
import {ConfigService} from './services/config.service';
import {ClientService} from './services/client.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MainRouterModule
  ],
  providers: [
    ConfigService,
    ClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
