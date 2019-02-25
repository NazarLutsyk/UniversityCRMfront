import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GooglePlacesDirective} from '../directives/google-places.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GooglePlacesDirective
  ],
  exports: [
    GooglePlacesDirective
  ]
})
export class SharedModule { }
