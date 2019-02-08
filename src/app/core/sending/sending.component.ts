import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {Group} from '../../models/group';
import {Client} from '../../models/client';
import {MaterialTableService} from '../../services/material-table.service';
import {ClientService} from '../../services/client.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {SendingService} from '../../services/sending.service';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from '../notifications/notification-type';

@Component({
  selector: 'app-sending',
  templateUrl: './sending.component.html',
  styleUrls: ['./sending.component.css']
})
export class SendingComponent implements OnInit {

  groups: Group[] = [];
  clients: Client[] = [];
  selectedClients: Client[] = [];
  selectedClientsToShow: Client[] = [];

  filter: any = {
    name: '',
    surname: '',
    email: '',
    phone: '',
    group: null,
    freebie: false,
    debtor: false
  };

  count = 0;
  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  selectedClientsPageIndex = 1;
  selectedClientsCountOfPages = 1;

  disableEmailButton = false;
  disablePhoneButton = false;

  constructor(
    private groupService: GroupService,
    private materialTableService: MaterialTableService,
    private clientService: ClientService,
    private storageService: StorageService,
    private router: Router,
    private sendingService: SendingService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.loadClients();
    this.groupService.getGroups({}).subscribe(g => this.groups = g.models);
    if (this.storageService.sendingLevel.selectedClients) {
      this.selectedClients = this.storageService.sendingLevel.selectedClients;
      this.selectedClientsCountOfPages =
        this.materialTableService.calcCountOfPages(this.selectedClients.length, this.pageSize);
      const startIndex = (this.selectedClientsPageIndex * this.pageSize) - this.pageSize;
      const endIndex = startIndex * 2 > 0 ? startIndex * 2 : this.pageSize;
      this.selectedClientsToShow = this.selectedClients.slice(startIndex, endIndex);
    }
  }

  loadClients() {
    this.sendLoadClients().subscribe(response => {
      this.count = response.count;
      this.clients = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  private sendLoadClients(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.clientService.getClients({
      q: filterToSend,
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['application'],
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
    if (this.filter.group) {
      res.application = {groupId: this.filter.group};
    }
    if (this.filter.freebie) {
      res.freebie = true;
    }
    if (this.filter.debtor) {
      res.debtor = true;
    }
    return res;
  }

  checkClient(client: Client) {
    const alreadyAdded = this.selectedClients.findIndex(c => c.id === client.id);
    if (alreadyAdded > -1) {
      this.selectedClients.splice(alreadyAdded, 1);
    } else {
      this.selectedClients.push(client);
    }
    this.selectedClientsCountOfPages =
      this.materialTableService.calcCountOfPages(this.selectedClients.length, this.pageSize);
    const startIndex = (this.selectedClientsPageIndex * this.pageSize) - this.pageSize;
    const endIndex = startIndex * 2 > 0 ? startIndex * 2 : this.pageSize;
    this.selectedClientsToShow = this.selectedClients.slice(startIndex, endIndex);
  }

  isSelected(client) {
    return this.selectedClients.findIndex(c => c.id === client.id) > -1;
  }

  openClient(client: Client) {
    this.storageService.sendingLevel.selectedClients = this.selectedClients;
    this.router.navigate(['clients', client.id]);
  }

  checkAllClients() {
    for (const client of this.clients) {
      const alreadyAdded = this.selectedClients.findIndex(c => c.id === client.id);
      if (alreadyAdded === -1) {
        this.selectedClients.push(client);
      }
    }
    const startIndex = (this.selectedClientsPageIndex * this.pageSize) - this.pageSize;
    const endIndex = startIndex * 2 > 0 ? startIndex * 2 : this.pageSize;
    this.selectedClientsToShow = this.selectedClients.slice(startIndex, endIndex);
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

  loadPaginatedSelectedClients(offset: number, event: any) {
    this.selectedClientsPageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.selectedClientsCountOfPages,
      currentPage: this.selectedClientsPageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    const startIndex = (this.selectedClientsPageIndex * this.pageSize) - this.pageSize;
    const endIndex = startIndex * 2 > 0 ? startIndex * 2 : this.pageSize;
    this.selectedClientsToShow = this.selectedClients.slice(startIndex, endIndex);
  }


  sendBySms(text: string) {
    const phones = this.selectedClients.map(c => c.phone);
    this.disablePhoneButton = true;
    this.sendingService.sendSms(phones, text)
      .subscribe(
        () => {
          this.notificationService.$notificationData.next({
            text: 'SMS mailing had completed',
            date: new Date(),
            type: NotificationType.INFO
          });
          setTimeout(() => {
            this.disablePhoneButton = false;
          }, 1000 * 60 * 3);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  sendByEmail(text: string) {
    const emails = this.selectedClients.map(c => c.email);
    this.disableEmailButton = true;
    this.sendingService.sendMails(emails, text)
      .subscribe((res) => {
          this.notificationService.$notificationData.next({
            text: 'EMAIL mailing had completed',
            date: new Date(),
            type: NotificationType.INFO
          });
          setTimeout(() => {
            this.disableEmailButton = false;
          }, 1000 * 60 * 3);
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
