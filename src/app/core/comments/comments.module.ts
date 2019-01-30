import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentsTableComponent} from './comments-table/comments-table.component';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { UpdateCommentComponent } from './update-comment/update-comment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [CommentsTableComponent, UpdateCommentComponent],
  exports: [CommentsTableComponent]
})
export class CommentsModule {
}
