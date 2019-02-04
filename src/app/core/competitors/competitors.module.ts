import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompetitorsComponent} from './competitors.component';
import {SingleCompetitorComponent} from './single-competitor/single-competitor.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatSnackBarModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  declarations: [CompetitorsComponent, SingleCompetitorComponent]
})
export class CompetitorsModule {
}
