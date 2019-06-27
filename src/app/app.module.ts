import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDatepickerModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule
} from '@angular/material';
import {MainRouterModule} from './main-router.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {AuthInterceptorService} from './services/interceptors/auth-interceptor.service';
import {AuthService} from './services/auth.service';
import {NotificationInterceptorService} from './services/interceptors/notification-interceptor.service';
import {CheckResponseInterceptorService} from './services/interceptors/checkResponse.service';
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule} from '@angular/material-moment-adapter';
import {MomentUtcDateAdapter} from './adapters/moment-utc-date-adapter';
import {TasksModule} from './core/tasks/tasks.module';
import {HeaderComponent} from './elements/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MainRouterModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    TasksModule,
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
    { provide: MAT_DATE_LOCALE, useValue: 'uk' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter }
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
