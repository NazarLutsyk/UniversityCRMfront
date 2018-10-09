import {Component, OnInit} from '@angular/core';
import {Client} from '../../models/client';
import {ClientService} from '../../services/client.service';
import {Observable} from 'rxjs';
import {MaterialTableHeader} from '../material-table/material-table.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  headers: MaterialTableHeader[] = [];

  constructor(
    private clietnsService: ClientService
  ) {
  }

  ngOnInit() {
    this.headers = [
      {header: 'Name', key: 'name'},
      {header: 'Surname', key: 'surname'},
      {header: 'Phone', key: 'phone'},
      {header: 'Email', key: 'email'},
      {header: 'Passport', key: 'passport'},
    ];
    this.loadClients().subscribe(clients => {
      this.clients = clients;
      console.log(this.clients);
    });
  }

  loadClients(): Observable<Client[]> {
    return this.clietnsService.getClients();
  }

}
