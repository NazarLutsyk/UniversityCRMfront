import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MaterialTableService} from '../../../services/material-table.service';
import {Observable} from 'rxjs';
import {PaymentService} from '../../../services/payment.service';
import {ConfigService} from '../../../services/config.service';
import {Payment} from '../../../models/payment';
import {MatDialog} from '@angular/material';
import {UfileComponent} from '../../ufile/ufile.component';
import {UfileTypes} from '../../ufile/ufile-types';
import {PaymentUpdateComponent} from '../payment-update/payment-update.component';
import {isNumber} from 'util';
import {Router} from '@angular/router';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.css']
})
export class PaymentsTableComponent implements OnInit {

  @Input() byApplicationId;
  @Input() openedApplication;
  @Output() onPaymentRemove = new EventEmitter<any>();
  @Output() onPaymentUpdate = new EventEmitter<any>();

  payments: Payment[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  now = new Date();


  constructor(
    private paymentService: PaymentService,
    public materialTableService: MaterialTableService,
    private dialog: MatDialog,
    private configService: ConfigService,
    private router: Router
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
      event: event,
    });
    this.loadPayments();
  }

  private sendLoadPayments(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.paymentService.getPayments({
      q: filterToSend,
      sort: this.sort ? this.sort : 'expectedDate ASC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: [
        this.byApplicationId ? '' : 'application>client',
        this.byApplicationId ? '' : 'application>course',
        'file'
      ],
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
    if (this.filter.expectedAmount) {
      res.expectedAmount = this.filter.expectedAmount;
    }
    if (this.byApplicationId) {
      res.applicationId = this.byApplicationId;
    }
    if (this.filter['client.fullname']) {
      res.client = {fullname: `${this.filter['client.fullname']}`};
    }
    if (this.filter['course.name']) {
      res.course = {name: `${this.filter['course.name']}`};
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

  editFiles(payment: Payment, $event) {
    $event.stopPropagation();
    const filesDialogRef = this.dialog.open(UfileComponent, {
      disableClose: true,
      minWidth: '40%',
      data: {
        targetId: payment.id,
        files: payment.files,
        type: UfileTypes.PAYMENT
      }
    });
    filesDialogRef.afterClosed().subscribe((result) => {
      this.loadPayments();
    });
  }

  generatePaymentFile(payment, $event) {
    $event.stopPropagation();
    payment.application = this.openedApplication;
    this.paymentService
      .createFile(<number>payment.id, payment)
      .subscribe((files) => {
        if (files) {
          for (let i = 0; i < files.length; i++) {
            this.downloadFile(files[i]);
          }
          this.loadPayments();
        }
      });
  }

  downloadFile(file) {
    window.open(`${this.configService.public}/${file.path}`);
  }

  open(payment: Payment, $event) {
    $event.stopPropagation();
    const isControl = $event.target.dataset.controls;
    if (isControl) {
      return false;
    }
    const matDialogRef = this.dialog.open(PaymentUpdateComponent, {
      disableClose: true,
      minWidth: '40%',
      data: {
        payment
      }
    });
    matDialogRef.afterClosed().subscribe((updated) => {
      if (updated && updated.id) {
        payment.expectedDate = updated.expectedDate;
        payment.paymentDate = updated.paymentDate;
        payment.amount = updated.amount;
        payment.expectedAmount = updated.expectedAmount;
        payment.number = updated.number;
        this.onPaymentUpdate.emit();
      }
    });
  }

  checkFailedPayment(payment: Payment) {
    if (payment.paymentDate) {
      return true;
    } else if (new Date(payment.expectedDate) <= this.now) {
      return false;
    }
  }


  openLink(id, url, $event) {
    $event.stopPropagation();
    const isControl = $event.target.dataset.controls;
    if (isControl || !isNumber(id)) {
      return false;
    }
    this.router.navigate([...url.split('/'), id]);
  }

}
