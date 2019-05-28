import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DATE_LOCALE, MatIconModule, MatMenuModule, MatToolbarModule} from '@angular/material';
import {MainRouterModule} from './main-router.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {AuthInterceptorService} from './services/interceptors/auth-interceptor.service';
import {AuthService} from './services/auth.service';
import {NotificationInterceptorService} from './services/interceptors/notification-interceptor.service';
import {CheckResponseInterceptorService} from './services/interceptors/checkResponse.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MainRouterModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CheckResponseInterceptorService,
      multi: true
    },
    {provide: MAT_DATE_LOCALE, useValue: 'uk'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor(
    private authService: AuthService
  ) {
    authService.getPrincipal().subscribe();
  }
}
