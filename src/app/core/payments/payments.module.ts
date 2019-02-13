import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaymentsTableComponent} from './payments-table/payments-table.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import {UfileModule} from '../ufile/ufile.module';
import {PaymentsComponent} from './payments.component';
import {PaymentUpdateComponent} from './payment-update/payment-update.component';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    UfileModule,
    MatDatepickerModule,
    ChartsModule,
    MatNativeDateModule,
  ],
  declarations: [PaymentsTableComponent, PaymentsComponent, PaymentUpdateComponent],
  exports: [PaymentsTableComponent]
})
export class PaymentsModule {
}
