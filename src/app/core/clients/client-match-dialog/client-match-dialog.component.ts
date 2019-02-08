import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Client} from '../../../models/client';
import {Router} from '@angular/router';

@Component({
  selector: 'app-client-match-dialog',
  templateUrl: './client-match-dialog.component.html',
  styleUrls: ['./client-match-dialog.component.css']
})
export class ClientMatchDialogComponent implements OnInit {

  clients: Client[] = [];

  constructor(
    private dialogRef: MatDialogRef<ClientMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.clients = this.data.clients;
  }

  close(create: boolean) {
    this.dialogRef.close(create);
  }
}
