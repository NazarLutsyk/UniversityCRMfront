import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompetitorApplicationsComponent} from './competitor-applications.component';
import {CompetitorApplicationsTableComponent} from './competitor-applications-table/competitor-applications-table.component';
import {
  MatButtonModule,
  MatCheckboxModule, MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SingleCompetitorApplicationComponent} from './single-competitor-application/single-competitor-application.component';
import {ApplicationsModule} from '../applications/applications.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ApplicationsModule
  ],
  declarations: [CompetitorApplicationsComponent, SingleCompetitorApplicationComponent, CompetitorApplicationsTableComponent]
})
export class CompetitorApplicationsModule {
}
