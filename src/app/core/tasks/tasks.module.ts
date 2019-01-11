import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TasksComponent} from './tasks.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import {SingleTaskComponent} from './single-task/single-task.component';
import { TasksTableComponent } from './tasks-table/tasks-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [TasksComponent, SingleTaskComponent, TasksTableComponent],
  exports: [TasksTableComponent]
})
export class TasksModule {
}
