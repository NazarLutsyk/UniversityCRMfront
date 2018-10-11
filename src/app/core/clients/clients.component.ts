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

  sort = '';
  filter: any = {};

  constructor(
    private clietnsService: ClientService
  ) {
  }

  ngOnInit() {
    this.headers = [
      {header: 'Name', key: 'name', filtered: true},
      {header: 'Surname', key: 'surname', filtered: true},
      {header: 'Phone', key: 'phone', filtered: true},
      {header: 'Email', key: 'email', filtered: true},
      {header: 'Passport', key: 'passport', filtered: false}
    ];
    this.loadClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  loadClients(): Observable<Client[]> {
    const filterToSend = this.getFilterToSend();

    return this.clietnsService.getClients({
      q: filterToSend,
      sort: this.sort
    });
  }

  loadSorted($event: string) {
    this.sort = $event;
    this.loadClients().subscribe(clients => this.clients = clients);
  }

  loadFiltered($event: any) {
    this.filter = $event;
    this.loadClients().subscribe(clients => this.clients = clients);
  }

  getFilterToSend() {
    const res: any = {};

    if (this.filter.name) {
      res.name = {$like: `${this.filter.name}`};
    }
    if (this.filter.surname) {
      res.surname = {$like: `${this.filter.surname}`};
    }
    if (this.filter.phone) {
      res.phone = {$like: `${this.filter.phone}`};
    }
    if (this.filter.email) {
      res.email = {$like: `${this.filter.email}`};
    }

    return res;
  }

}
