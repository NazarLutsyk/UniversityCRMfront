import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { SingleCourseComponent } from './single-course/single-course.component';
import {GroupsModule} from '../groups/groups.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    GroupsModule
  ],
  declarations: [CoursesComponent, SingleCourseComponent]
})
export class CoursesModule { }
