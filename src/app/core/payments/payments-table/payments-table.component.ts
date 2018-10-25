import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {Observable} from 'rxjs';
import {PaymentService} from '../../../services/payment.service';
import {Payment} from '../../../models/payment';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.css']
})
export class PaymentsTableComponent implements OnInit {

  @Input() byApplicationId;
  @Output() onPaymentRemove = new EventEmitter<any>();

  payments: Payment[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};


  constructor(
    private paymentService: PaymentService,
    private router: Router,
    public materialTableService: MaterialTableService,
  ) {
  }

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.sendLoadPayments().subscribe(response => {
      this.count = response.count;
      this.payments = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadPayments();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadPayments();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadPayments();
  }

  private sendLoadPayments(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.paymentService.getPayments({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['application']
    });
  }

  private getFilterToSend() {
    const res: any = {};
    if (this.filter.number) {
      res.number = {$like: `${this.filter.number}`};
    }
    if (this.filter.amount) {
      res.amount = this.filter.amount;
    }
    if (this.byApplicationId) {
      res.application = {id: this.byApplicationId};
    }

    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.paymentService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadPayments();
        this.onPaymentRemove.emit();
      });
    });
  }

}
