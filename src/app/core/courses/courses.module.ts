import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { SingleCourseComponent } from './single-course/single-course.component';
import {GroupsModule} from '../groups/groups.module';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    GroupsModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [CoursesComponent, SingleCourseComponent]
})
export class CoursesModule { }
