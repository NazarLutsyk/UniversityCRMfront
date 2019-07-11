import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UfileComponent} from '../../ufile/ufile.component';
import {Payment} from '../../../models/payment';
import {PaymentService} from '../../../services/payment.service';
import {PaymentStatus} from '../../../models/paymentStatus';
import {PaymentStatusService} from '../../../services/payment-status.service';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.component.html',
  styleUrls: ['./payment-update.component.css']
})
export class PaymentUpdateComponent implements OnInit {
  paymentStatuses: PaymentStatus[] = [];
  payment: Payment;

  constructor(
    private dialogRef: MatDialogRef<UfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private paymentStatusService: PaymentStatusService
  ) {
  }

  ngOnInit() {
    this.payment = {...this.data.payment};
    this.paymentStatusService.getStatuses({}).subscribe(value => {
      this.paymentStatuses = value.models;
    });
  }

  updatePayment() {
    const paymentToUpdate: Payment = <Payment>{
      number: this.payment.number,
      expectedDate: this.payment.expectedDate,
      paymentDate: this.payment.paymentDate,
      amount: this.payment.amount ? this.payment.amount : 0,
      paymentStatusId: this.payment.paymentStatusId,
      expectedAmount: this.payment.expectedAmount ? this.payment.expectedAmount : 0,
    };
    this.paymentService.update(
      this.payment.id,
      paymentToUpdate
    ).subscribe((updated) => {
      this.dialogRef.close(updated);
      this.paymentService.refreshPaymentsTableSubject.next('refreshTable');
    });
  }


}
