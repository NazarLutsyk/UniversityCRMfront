import {Component, OnInit} from '@angular/core';
import {PaymentStatusService} from '../../services/payment-status.service';
import {NgForm} from '@angular/forms';
import {PaymentStatus} from '../../models/paymentStatus';
import {Observable} from 'rxjs';
import {ClientStatus} from '../../models/client-status';
import {isNumber} from 'util';
import {MaterialTableService} from '../../services/material-table.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {
  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;
  statuses: PaymentStatus[] = [];
  count = 0;

  sort = '';
  filter: any = {};

  constructor(
    private paymentStatusService: PaymentStatusService,
    public materialTableService: MaterialTableService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStatuses();
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
    return this.paymentStatusService.getStatuses({
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
    const status: PaymentStatus = <PaymentStatus>statusForm.form.value;
    this.paymentStatusService.create(status).subscribe((statusResponse) => {
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
      this.paymentStatusService.remove(id).subscribe((removed) => {
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

}
