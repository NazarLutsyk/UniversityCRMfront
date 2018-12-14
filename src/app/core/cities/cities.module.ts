import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CitiesComponent} from './cities.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatSnackBarModule} from '@angular/material';
import { SingleCityComponent } from './single-city/single-city.component';

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
  declarations: [CitiesComponent, SingleCityComponent]
})
export class CitiesModule {
}
