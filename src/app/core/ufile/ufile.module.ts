import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UfileComponent} from './ufile.component';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  declarations: [UfileComponent],
  exports: [UfileComponent]
})
export class UfileModule {
}
