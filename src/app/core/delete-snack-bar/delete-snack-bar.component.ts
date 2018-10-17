import {Component, OnInit} from '@angular/core';
import {MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'app-delete-snack-bar',
  templateUrl: './delete-snack-bar.component.html',
  styleUrls: ['./delete-snack-bar.component.css']
})
export class DeleteSnackBarComponent implements OnInit {

  constructor(private snackBarRef: MatSnackBarRef<DeleteSnackBarComponent>) {
  }

  ngOnInit() {
  }

  clickOk() {
    this.snackBarRef.dismissWithAction();
  }

  clickCancel() {
    this.snackBarRef.dismiss();
  }

}
