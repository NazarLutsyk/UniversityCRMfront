import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentsTableComponent} from './comments-table/comments-table.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatFormFieldModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [CommentsTableComponent],
  exports: [CommentsTableComponent]
})
export class CommentsModule {
}
