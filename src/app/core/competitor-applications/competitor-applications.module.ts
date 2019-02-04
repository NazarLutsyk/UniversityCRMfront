import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompetitorApplicationsComponent} from './competitor-applications.component';
import {SingleCompetitorApplicationComponent} from './single-competitor-application/single-competitor-application.component';

@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [CompetitorApplicationsComponent, SingleCompetitorApplicationComponent]
})
export class CompetitorApplicationsModule {
}
