import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RatingsComponent} from './ratings.component';
import {RatingsTableComponent} from './ratings-table/ratings-table.component';
import {SingleRatingComponent} from './single-rating/single-rating.component';
import {
  MatButtonModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { SingleRatingInfoComponent } from './single-rating-info/single-rating-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  declarations: [RatingsComponent, RatingsTableComponent, SingleRatingComponent, SingleRatingInfoComponent]
})
export class RatingsModule {
}
