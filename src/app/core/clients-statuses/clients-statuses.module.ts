import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClientsStatusesComponent} from './clients-statuses.component';
import { SingleClientStatusComponent } from './single-client-status/single-client-status.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule, MatNativeDateModule,
  MatSnackBarModule
} from '@angular/material';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    ClientsStatusesComponent,
    SingleClientStatusComponent
  ]
})
export class ClientsStatusesModule { }
