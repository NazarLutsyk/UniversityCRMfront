import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompetitorsComponent} from './competitors.component';
import {SingleCompetitorComponent} from './single-competitor/single-competitor.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule, MatNativeDateModule,
  MatSnackBarModule
} from '@angular/material';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [CompetitorsComponent, SingleCompetitorComponent]
})
export class CompetitorsModule {
}
