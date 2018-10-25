import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaymentsTableComponent} from './payments-table/payments-table.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [PaymentsTableComponent],
  exports: [PaymentsTableComponent]
})
export class PaymentsModule {
}
