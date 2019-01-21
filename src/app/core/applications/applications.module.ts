import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationsComponent} from './applications.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatListModule, MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {SingleApplicationComponent} from './single-application/single-application.component';
import {ApplicationsTableComponent} from './applications-table/applications-table.component';
import {PaymentsModule} from '../payments/payments.module';
import {UfileModule} from '../ufile/ufile.module';

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
    MatDividerModule,
    PaymentsModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    UfileModule,
  ],
  declarations: [ApplicationsComponent, SingleApplicationComponent, ApplicationsTableComponent],
  exports: [ApplicationsTableComponent]
})
export class ApplicationsModule {
}
