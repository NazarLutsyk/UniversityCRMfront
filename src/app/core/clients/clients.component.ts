import {Component, OnInit} from '@angular/core';
import {Client} from '../../models/client';
import {ClientService} from '../../services/client.service';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../services/material-table.service';
import {isNumber} from 'util';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  selectEvent = null;

  constructor(
    private clientsService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public materialTableService: MaterialTableService,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((query) => {
      if (query.selectEvent) {
        this.selectEvent = {
          backURL: query.backURL
        };
      }
    });
    this.loadClients();
  }

  loadClients() {
    this.sendLoadClients().subscribe(response => {
      this.count = response.count;
      this.clients = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadClients();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadClients();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadClients();
  }

  private sendLoadClients(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.clientsService.getClients({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize
    });
  }

  private getFilterToSend() {
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

  createClient(clientForm: NgForm) {
    const client: Client = <Client>clientForm.form.value;
    this.clientsService.create(client).subscribe((clientResponse) => {
      clientForm.resetForm();
      this.loadClients();
    });
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.clientsService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadClients();
      });
    });
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


}
