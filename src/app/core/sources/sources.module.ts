import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SourcesComponent} from './sources.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {SingleSourceComponent} from './single-source/single-source.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [SourcesComponent, SingleSourceComponent]
})
export class SourcesModule {
}
