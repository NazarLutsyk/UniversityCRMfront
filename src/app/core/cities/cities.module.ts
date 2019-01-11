import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CitiesComponent} from './cities.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule, MatNativeDateModule,
  MatSnackBarModule
} from '@angular/material';
import { SingleCityComponent } from './single-city/single-city.component';
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
  declarations: [CitiesComponent, SingleCityComponent]
})
export class CitiesModule {
}
