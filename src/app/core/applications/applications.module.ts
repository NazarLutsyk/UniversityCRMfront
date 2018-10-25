import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationsComponent} from './applications.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import { SingleApplicationComponent } from './single-application/single-application.component';
import { ApplicationsTableComponent } from './applications-table/applications-table.component';
import {PaymentsModule} from '../payments/payments.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PaymentsModule
  ],
  declarations: [ApplicationsComponent, SingleApplicationComponent, ApplicationsTableComponent],
  exports: [ApplicationsTableComponent]
})
export class ApplicationsModule {
}
