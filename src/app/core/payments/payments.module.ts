import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaymentsTableComponent} from './payments-table/payments-table.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {UfileModule} from '../ufile/ufile.module';

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
  ],
  declarations: [PaymentsTableComponent],
  exports: [PaymentsTableComponent]
})
export class PaymentsModule {
}
