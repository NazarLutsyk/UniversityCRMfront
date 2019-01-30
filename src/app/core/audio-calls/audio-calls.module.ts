import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AudioCallsTableComponent } from './audio-calls-table/audio-calls-table.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import {UfileModule} from '../ufile/ufile.module';
import { UpdateAudioCallComponent } from './update-audio-call/update-audio-call.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    UfileModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [AudioCallsTableComponent, UpdateAudioCallComponent],
  exports: [AudioCallsTableComponent]
})
export class AudioCallsModule {
}
