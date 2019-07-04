import { Component, OnInit } from '@angular/core';
import {ClientStatus} from '../../../models/client-status';
import {ActivatedRoute} from '@angular/router';
import {ClientStatusService} from '../../../services/client-status.service';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';
import {NgForm} from '@angular/forms';
import {PaymentStatusService} from '../../../services/payment-status.service';
import {PaymentStatus} from '../../../models/paymentStatus';

@Component({
  selector: 'app-single-payment-status',
  templateUrl: './single-payment-status.component.html',
  styleUrls: ['./single-payment-status.component.css']
})
export class SinglePaymentStatusComponent implements OnInit {


  status: PaymentStatus = new PaymentStatus();


  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentStatusService: PaymentStatusService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.paymentStatusService.getStatusById(id, {attributes: ['id', 'name', 'description']})
        .subscribe(status => {
          this.status = status;
        });
    });
  }


  updateStatus() {
    this.paymentStatusService.update(this.status.id, this.status).subscribe(updated => this.status = updated);
  }

}
