import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LessonsTableComponent} from './lessons-table/lessons-table.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  declarations: [LessonsTableComponent],
  exports: [LessonsTableComponent]
})
export class LessonsModule {
}
