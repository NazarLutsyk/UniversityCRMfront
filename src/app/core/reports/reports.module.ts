import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule} from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {ApplicationsModule} from '../applications/applications.module';
import {LessonsModule} from '../lessons/lessons.module';
import {ChartsModule} from 'ng2-charts';
import {ReportsComponent} from './reports.component';
import {GroupsModule} from '../groups/groups.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    ApplicationsModule,
    LessonsModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    GroupsModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
