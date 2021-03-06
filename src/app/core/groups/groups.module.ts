import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupsComponent} from './groups.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule, MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule, MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {SingleGroupComponent} from './single-group/single-group.component';
import {GroupsTableComponent} from './groups-table/groups-table.component';
import {ApplicationsModule} from '../applications/applications.module';
import {LessonsModule} from '../lessons/lessons.module';
import {ChartsModule} from 'ng2-charts';

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
    MatNativeDateModule
  ],
  declarations: [GroupsComponent, SingleGroupComponent, GroupsTableComponent],
  exports: [GroupsTableComponent]
})
export class GroupsModule {
}
