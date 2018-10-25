import {Component, OnInit, ViewChild} from '@angular/core';
import {Application} from '../../../models/application';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {SourceService} from '../../../services/source.service';
import {Source} from '../../../models/source';
import {Payment} from '../../../models/payment';
import {PaymentService} from '../../../services/payment.service';

@Component({
  selector: 'app-single-application',
  templateUrl: './single-application.component.html',
  styleUrls: ['./single-application.component.css']
})
export class SingleApplicationComponent implements OnInit {

  @ViewChild('paymentTable') paymentTable;

  application: Application = new Application();

  sources: Source[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private sourceService: SourceService,
    private paymentService: PaymentService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.sourceService.getSources({}).subscribe(response => this.sources = response.models);
      this.loadApplication(id);
    });
  }

  loadApplication(id) {
    this.applicationService.getApplicationById(id, {
      attributes: ['id', 'date', 'fullPrice', 'discount', 'resultPrice', 'leftToPay', 'sourceId'],
      include: ['client', 'source', 'course', 'group', 'contract', 'audio_calls', 'lessons']
    })
      .subscribe(application => this.application = application);
  }

  updateApplication() {
    const applicationToUpdate = {
      sourceId: this.application.sourceId,
      date: this.application.date,
    };
    this.applicationService.update(this.application.id, applicationToUpdate).subscribe(updated => {
      this.loadApplication(updated.id);
    });
  }

  validateAmount($event) {
    const value = $event.target.value;
    if (value < 1) {
      $event.target.value = null;
    }
    if (value > this.application.leftToPay) {
      $event.target.value = this.application.leftToPay;
    }
  }

  createPayment(paymentForm) {
    const paymentFormValue: Payment = <Payment>paymentForm.form.value;
    const payment: Payment = <Payment>{
      number: paymentFormValue.number,
      date: paymentFormValue.date,
      amount: paymentFormValue.amount,
      applicationId: this.application.id
    };
    this.paymentService.create(payment).subscribe(() => {
      paymentForm.resetForm();
      this.paymentTable.loadPayments();
      this.loadApplication(this.application.id);
    });
  }
}
