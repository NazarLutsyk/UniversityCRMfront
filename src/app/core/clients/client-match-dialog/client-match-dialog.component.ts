import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Client} from '../../../models/client';
import {Router} from '@angular/router';
import {isNumber} from 'util';

@Component({
  selector: 'app-client-match-dialog',
  templateUrl: './client-match-dialog.component.html',
  styleUrls: ['./client-match-dialog.component.css']
})
export class ClientMatchDialogComponent implements OnInit {

  clients: Client[] = [];
  selectEvent = null;
  constructor(
    private dialogRef: MatDialogRef<ClientMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.clients = this.data.clients;
  }

  open(client, url, $event) {
    $event.stopPropagation();
    if (this.selectEvent) {
      this.router.navigate(this.selectEvent.backURL, {queryParams: {client: JSON.stringify(client)}});
      this.selectEvent = null;
    } else {
      const isControl = $event.target.dataset.controls;
      if (isControl || !isNumber(client.id)) {
        return false;
      }
      this.router.navigate([...url.split('/'), client.id]);
    }
  }

  close(create: boolean) {
    this.dialogRef.close(create);
  }
}
