import {Component, Input, OnInit} from '@angular/core';
import {Manager} from '../../../models/manager';
import {ManagerService} from '../../../services/manager.service';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {Observable} from 'rxjs';
import {isNumber} from 'util';

@Component({
  selector: 'app-managers-table',
  templateUrl: './managers-table.component.html',
  styleUrls: ['./managers-table.component.css']
})
export class ManagersTableComponent implements OnInit {
  managers: Manager[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};


  constructor(
    private managersService: ManagerService,
    private router: Router,
    public materialTableService: MaterialTableService
  ) {
  }

  ngOnInit() {
    this.loadManagers();
  }

  loadManagers() {
    this.sendLoadManagers().subscribe(response => {
      this.count = response.count;
      this.managers = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadManagers();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadManagers();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadManagers();
  }

  private sendLoadManagers(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.managersService.getManagers({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
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
    if (this.filter.login) {
      res.login = {$like: `${this.filter.login}`};
    }
    if (this.filter.role) {
      res.role = {$like: `${this.filter.role}`};
    }

    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.managersService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadManagers();
      });
    });
  }

  open(id, url, $event) {
    $event.stopPropagation();
    const isControl = $event.target.dataset.controls;
    if (isControl || !isNumber(id)) {
      return false;
    }
    this.router.navigate([...url.split('/'), id]);
  }

}
