import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagersComponent } from './managers.component';
import { SingleManagerComponent } from './single-manager/single-manager.component';
import { ManagersTableComponent } from './managers-table/managers-table.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
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
    ChartsModule
  ],
  declarations: [ManagersComponent, SingleManagerComponent, ManagersTableComponent]
})
export class ManagersModule { }
