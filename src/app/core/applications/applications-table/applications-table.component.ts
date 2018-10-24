import {Component, Input, OnInit} from '@angular/core';
import {Application} from '../../../models/application';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {ApplicationService} from '../../../services/application.service';
import {Observable} from 'rxjs';
import {isNumber} from 'util';

@Component({
  selector: 'app-applications-table',
  templateUrl: './applications-table.component.html',
  styleUrls: ['./applications-table.component.css']
})
export class ApplicationsTableComponent implements OnInit {

  @Input() byGroupId;

  applications: Application[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public materialTableService: MaterialTableService,
    public applicationService: ApplicationService,
  ) {
  }

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.sendLoadApplications().subscribe(response => {
      this.count = response.count;
      this.applications = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadApplications();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadApplications();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadApplications();
  }

  private sendLoadApplications(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.applicationService.getApplications({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['client', 'course', 'group', 'source']
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter['client.name']) {
      res.client = {name: `${this.filter['client.name']}`};
    }
    if (this.filter['course.name']) {
      res.course = {name: `${this.filter['course.name']}`};
    }
    if (this.filter['group.name']) {
      res.group = {name: `${this.filter['group.name']}`};
    }
    if (this.filter['source.name']) {
      res.source = {name: `${this.filter['source.name']}`};
    }
    if (this.filter.fullPrice) {
      res.fullPrice = this.filter.fullPrice;
    }
    if (this.filter.discount) {
      res.discount = this.filter.discount;
    }
    if (this.filter.resultPrice) {
      res.resultPrice = this.filter.resultPrice;
    }
    if (this.filter.leftToPay) {
      res.leftToPay = this.filter.leftToPay;
    }
    if (this.byGroupId) {
      res.group = {id: this.byGroupId, ...res.group};
    }

    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.applicationService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadApplications();
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
