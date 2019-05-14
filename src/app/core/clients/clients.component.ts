import {Component, OnInit, ViewChild} from '@angular/core';
import {Client} from '../../models/client';
import {ClientService} from '../../services/client.service';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../services/material-table.service';
import {isNumber} from 'util';
import {AuthService} from '../../services/auth.service';
import {MatDialog, MatExpansionPanel} from '@angular/material';
import {ClientMatchDialogComponent} from './client-match-dialog/client-match-dialog.component';
import {ClientStatusService} from '../../services/client-status.service';
import {ClientStatus} from '../../models/client-status';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  @ViewChild('form') clientForm: NgForm;
  @ViewChild('formPanel') formPanel: MatExpansionPanel;

  clients: Client[] = [];
  clientStatuses: ClientStatus[] = [];

  passportFilesToUpload: File[] = [];

  count = 0;
  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  selectEvent = null;

  clientFormObject = {
    name: null,
    surname: null,
    phone: null,
    email: null,
    address: null,
    statusId: ''
  };

  canCreateClient = false;
  canDeleteClient = false;

  constructor(
    private clientsService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public materialTableService: MaterialTableService,
    public authService: AuthService,
    private createClientDialog: MatDialog,
    private clientStatusesService: ClientStatusService
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
    setTimeout(() => {
      const clientJSON = this.activatedRoute.snapshot.queryParams.client;
      if (clientJSON) {
        try {
          const clientFromEapp = JSON.parse(clientJSON);
          this.formPanel.open();
          this.clientFormObject.name = clientFromEapp.name;
          this.clientFormObject.surname = clientFromEapp.surname;
          this.clientFormObject.email = clientFromEapp.phone;
          this.clientFormObject.phone = clientFromEapp.email;
        } catch (e) {
          this.clientFormObject.name = null;
          this.clientFormObject.surname = null;
          this.clientFormObject.email = null;
          this.clientFormObject.phone = null;
        }
      }
    }, 0);
    this.loadClients();

    const p = this.authService.getLocalPrincipal();
    this.canCreateClient = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
    this.canDeleteClient = this.canCreateClient;
    this.clientStatusesService.getStatuses({}).subscribe(res => this.clientStatuses = res.models);
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
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['social', 'address']
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
    if (this.filter['social.url']) {
      res.social = {url: `${this.filter['social.url']}`};
    }

    return res;
  }

  createClient(clientForm: NgForm) {
    const client: Client = <Client>clientForm.form.value;

    this.clientsService.exists(client).subscribe((alreadyExistsClients) => {
      if (alreadyExistsClients && alreadyExistsClients.length > 0) {
        const createDialog = this.createClientDialog.open(ClientMatchDialogComponent, {
          disableClose: true,
          minWidth: '40%',
          data: {
            clients: alreadyExistsClients
          }
        });
        createDialog.afterClosed().subscribe((reallyCreate) => {
          if (reallyCreate) {
            this.sendCreateClient(clientForm);
          }
        });
      } else {
        this.sendCreateClient(clientForm);
      }
    });
  }

  private sendCreateClient(clientForm: NgForm) {
    const client: Client = <Client>this.clientFormObject;
    this.clientsService.create(client).subscribe((clientResponse) => {
      if (this.passportFilesToUpload && this.passportFilesToUpload.length > 0) {
        this.clientsService
          .uploadPassportFiles(clientResponse.id, this.passportFilesToUpload)
          .subscribe();
      }
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

  passportChange($event) {
    this.passportFilesToUpload = (<any>$event.target).files;
  }

  setAddress(address: any) {
    this.clientFormObject.address = address;
  }
}
