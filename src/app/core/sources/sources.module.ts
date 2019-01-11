import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SourcesComponent} from './sources.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import {SingleSourceComponent} from './single-source/single-source.component';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [SourcesComponent, SingleSourceComponent]
})
export class SourcesModule {
}
