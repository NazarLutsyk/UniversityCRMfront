import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material';
import {MainRouterModule} from './main-router.module';
import {HttpClientModule} from '@angular/common/http';
import {ConfigService} from './services/config.service';
import {ClientService} from './services/client.service';
import {CoreModule} from './core/core.module';
import {BreadcrumbsService} from './services/breadcrumbs.service';
import {MaterialTableService} from './services/material-table.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MainRouterModule,
  ],
  providers: [
    ConfigService,
    ClientService,
    BreadcrumbsService,
    MaterialTableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
