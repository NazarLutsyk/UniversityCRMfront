import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AudioCallsTableComponent } from './audio-calls-table/audio-calls-table.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {UfileModule} from '../ufile/ufile.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    UfileModule,
  ],
  declarations: [AudioCallsTableComponent],
  exports: [AudioCallsTableComponent]
})
export class AudioCallsModule {
}
