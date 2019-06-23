import { Component, OnInit } from '@angular/core';
import {ClientStatusService} from '../../services/client-status.service';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../services/material-table.service';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
// @ts-ignore
import {isNumber} from 'util';
import {ClientStatus} from '../../models/client-status';
import {StatisticService} from '../../services/statistic.service';

@Component({
  selector: 'app-clients-statuses',
  templateUrl: './clients-statuses.component.html',
  styleUrls: ['./clients-statuses.component.css']
})
export class ClientsStatusesComponent implements OnInit {

  statuses: ClientStatus[] = [];
  count = 0;


  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;


  sort = '';
  filter: any = {};

  chartLabels: String[] = [];
  chartDatasets: any[] = [];
  chartColors: any[] = [];
  chartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 1
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          stepSize: 1000
        }
      }],
      responsive: true
    }
  };

  constructor(
    private statusesService: ClientStatusService,
    private router: Router,
    public materialTableService: MaterialTableService,
    private statisticService: StatisticService
  ) {
  }

  ngOnInit() {
    this.loadStatuses();
    this.loadStatistic();
  }

  loadStatuses() {
    this.sendLoadStatuses().subscribe(response => {
      this.count = response.count;
      this.statuses = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  private sendLoadStatuses(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.statusesService.getStatuses({
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
    return res;
  }

  createStatus(statusForm: NgForm) {
    const status: ClientStatus = <ClientStatus>statusForm.form.value;
    this.statusesService.create(status).subscribe((statusResponse) => {
      statusForm.resetForm();
      this.loadStatuses();
    });
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadStatuses();
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadStatuses();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadStatuses();
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.statusesService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadStatuses();
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

  loadStatistic(datesForm: NgForm = null, reset: boolean = false) {
    let startDate = '';
    let endDate = '';
    if (datesForm) {
      if (reset) {
        startDate = '';
        endDate = '';
        datesForm.resetForm({startDate: '', endDate: ''});
      } else {
        startDate = datesForm.value.startDate;
        endDate = datesForm.value.endDate;
      }
    }
    this.statisticService.getNumberOfClientByStatus({q: {startDate, endDate}}).subscribe((res) => {
      this.chartLabels = res.map(s => s.status);
      const data = res.map(s => s.count);
      this.chartDatasets = [
        {
          label: 'Clients',
          data,
        }
      ];
      const arr = res.map(s => s.color);
      this.chartColors = [{
        backgroundColor: arr
      }];
    });
  }

}
