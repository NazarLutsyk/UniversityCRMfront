import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UfileComponent} from '../../ufile/ufile.component';
import {CommentService} from '../../../services/comment.service';
import {Comment} from '../../../models/comment';

@Component({
  selector: 'app-update-comment',
  templateUrl: './update-comment.component.html',
  styleUrls: ['./update-comment.component.css']
})
export class UpdateCommentComponent implements OnInit {

  comment: Comment;

  constructor(
    private dialogRef: MatDialogRef<UfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commentService: CommentService
  ) {
  }

  ngOnInit() {
    this.comment = {...this.data.comment};
  }

  updateComment() {
    this.commentService.update(
      this.comment.id,
      <Comment>{text: this.comment.text, date: this.comment.date}
    ).subscribe((updated) => {
      this.dialogRef.close(updated);
    });
  }

}
