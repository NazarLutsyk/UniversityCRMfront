import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EApplicationsComponent } from './e-applications.component';
import { SingleEapplicationComponent } from './single-eapplication/single-eapplication.component';
import {MatTabsModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule
  ],
  declarations: [EApplicationsComponent, SingleEapplicationComponent]
})
export class EApplicationsModule { }
