import {Component, OnInit, ViewChild} from '@angular/core';
import {Application} from '../../../models/application';
import {ActivatedRoute, Router} from '@angular/router';
import {ApplicationService} from '../../../services/application.service';
import {SourceService} from '../../../services/source.service';
import {Source} from '../../../models/source';
import {Payment} from '../../../models/payment';
import {PaymentService} from '../../../services/payment.service';
import {GroupService} from '../../../services/group.service';
import {Group} from '../../../models/group';
import {MatSelectionListChange} from '@angular/material';

@Component({
  selector: 'app-single-application',
  templateUrl: './single-application.component.html',
  styleUrls: ['./single-application.component.css']
})
export class SingleApplicationComponent implements OnInit {

  @ViewChild('paymentTable') paymentTable;
  @ViewChild('groupsList') groupsList;

  application: Application = new Application();

  sources: Source[] = [];
  groups: Group[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private sourceService: SourceService,
    private paymentService: PaymentService,
    private groupService: GroupService
  ) {
  }

  ngOnInit() {
    this.groupsList.selectionChange.subscribe((s: MatSelectionListChange) => {
      const newGroupId = s.option.value != this.application.groupId ? s.option.value : null;
      this.groupsList.deselectAll();
      if (newGroupId) {
        s.option.selected = true;
      }
      this.applicationService.update(this.application.id, {groupId: newGroupId})
        .subscribe(() => {
          this.loadApplication(this.application.id);
        });
    });

    this.activatedRoute.params.subscribe(({id}) => {
      this.sourceService.getSources({}).subscribe(response => this.sources = response.models);
      this.loadApplication(id);
    });
  }

  loadApplication(id) {
    this.applicationService.getApplicationById(id, {
      attributes: ['id', 'date', 'fullPrice', 'discount', 'resultPrice', 'leftToPay', 'sourceId', 'courseId', 'groupId'],
      include: ['client', 'source', 'course', 'group', 'contract', 'audio_calls', 'lessons']
    })
      .subscribe(application => {
        this.application = application;
        this.loadGroups();
      });
  }

  loadGroups() {
    this.groupService.getGroups({
        q: {courseId: this.application.courseId}
      }
    )
      .subscribe(response => this.groups = response.models);
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

  openGroup(id: number, $event) {
    $event.stopPropagation();
    this.router.navigate(['groups', id]);
  }
}