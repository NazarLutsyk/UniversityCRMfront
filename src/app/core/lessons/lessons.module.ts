import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LessonsTableComponent} from './lessons-table/lessons-table.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule
} from '@angular/material';
import {SingleLessonComponent} from './single-lesson/single-lesson.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule,
    MatDividerModule,
    MatIconModule
  ],
  declarations: [LessonsTableComponent, SingleLessonComponent],
  exports: [LessonsTableComponent]
})
export class LessonsModule {
}
