import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {AuthService} from '../../../services/auth.service';
import {Observable} from 'rxjs';
import {isNumber} from 'util';
import {CompetitorApplication} from '../../../models/competitor-application';
import {CompetitorApplicationService} from '../../../services/competitor-application.service';

@Component({
  selector: 'app-competitor-applications-table',
  templateUrl: './competitor-applications-table.component.html',
  styleUrls: ['./competitor-applications-table.component.css']
})
export class CompetitorApplicationsTableComponent implements OnInit {

  @Input() byCompetitorId;

  competitorApplications: CompetitorApplication[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    private competitorApplicationsService: CompetitorApplicationService,
    private router: Router,
    public materialTableService: MaterialTableService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loadCompetitorApplications();
  }

  loadCompetitorApplications() {
    this.sendLoadCompetitorApplications().subscribe(response => {
      this.count = response.count;
      this.competitorApplications = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadCompetitorApplications();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadCompetitorApplications();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadCompetitorApplications();
  }

  private sendLoadCompetitorApplications(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.competitorApplicationsService.getCompetitorApplications({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['competitor', 'course', 'client']
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter['client.fullname']) {
      res.client = {fullname: `${this.filter['client.fullname']}`};
    }
    if (this.filter['competitor.name']) {
      res.competitor = {name: `${this.filter['competitor.name']}`};
    }
    if (this.filter['course.name']) {
      res.course = {name: `${this.filter['course.name']}`};
    }
    if (this.byCompetitorId) {
      res.competitor = {id: this.byCompetitorId};
    }

    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.competitorApplicationsService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadCompetitorApplications();
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
