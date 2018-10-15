import {Component, OnInit} from '@angular/core';
import {Client} from '../../models/client';
import {ClientService} from '../../services/client.service';
import {Observable} from 'rxjs';
import {MaterialTableHeader} from '../material-table/material-table.component';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  headers: MaterialTableHeader[] = [];
  count = 0;

  pageIndex = 1;
  pageSize = 9;

  sort = '';
  filter: any = {};

  constructor(
    private clientsService: ClientService
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
    this.loadClients();
  }

  private loadClients() {
    this.sendLoadClients().subscribe(response => {
      this.count = response.count;
      this.clients = response.models;
    });
  }

  sendLoadClients(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.clientsService.getClients({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize
    });
  }

  loadSorted($event: string) {
    this.sort = $event;
    this.loadClients();
  }

  loadFiltered($event: any) {
    this.filter = $event;
    this.loadClients();
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

  loadPaginated(nextPage: number) {
    this.pageIndex = nextPage;
    this.loadClients();
  }

  createClient(clientForm: NgForm) {
    const client: Client = <Client>clientForm.form.value;
    this.clientsService.create(client).subscribe((clientResponse) => {
      clientForm.resetForm();
      this.loadClients();
    });
  }

  remove(id) {
    this.clientsService.remove(id).subscribe((removed) => {
      const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
      if (countOfPages < this.pageIndex && this.pageIndex > 1) {
        --this.pageIndex;
      }
      this.loadClients();
    });
  }

  open(id) {
    // todo
  }
}
