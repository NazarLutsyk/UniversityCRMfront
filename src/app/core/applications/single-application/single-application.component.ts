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
import {MatDialog, MatSelectionListChange} from '@angular/material';
import {UfileComponent} from '../../ufile/ufile.component';
import {UfileTypes} from '../../ufile/ufile-types';

@Component({
  selector: 'app-single-application',
  templateUrl: './single-application.component.html',
  styleUrls: ['./single-application.component.css']
})
export class SingleApplicationComponent implements OnInit {

  @ViewChild('paymentTable') paymentTable;
  @ViewChild('groupsList') groupsList;

  application: Application = new Application();
  applicationSources: number[] = [];

  paymentFilesToUpload: File[] = [];

  sources: Source[] = [];
  groups: Group[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private sourceService: SourceService,
    private paymentService: PaymentService,
    private groupService: GroupService,
    private filesDialog: MatDialog
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
      attributes: [
        'id',
        'date',
        'fullPrice',
        'discount',
        'wantPractice',
        'hasPractice',
        'leftToPay',
        'certificate',
        'courseId',
        'groupId',
        'cityId'
      ],
      include: ['client', 'sources', 'course', 'group', 'contract', 'lessons', 'city']
    })
      .subscribe(application => {
        this.application = application;
        if (this.application.sources && this.application.sources.length > 0) {
          this.applicationSources = [];
          this.applicationSources = this.application.sources.map(source => source.id);
        }
        this.loadGroups();
      });
  }

  loadGroups() {
    this.groupService.getGroups({
        q: {
          courseId: this.application.courseId,
          cityId: this.application.cityId
        }
      }
    )
      .subscribe(response => this.groups = response.models);
  }

  updateApplication() {
    const applicationToUpdate = {
      sources: this.applicationSources,
      date: this.application.date,
      wantPractice: this.application.wantPractice ? 1 : 0,
      certificate: this.application.certificate,
      leftToPay: this.application.leftToPay,
      discount: this.application.discount,
      fullPrice: this.application.fullPrice,
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
      expectedDate: paymentFormValue.expectedDate,
      amount: paymentFormValue.amount ? paymentFormValue.amount : 0,
      expectedAmount: paymentFormValue.expectedAmount ? paymentFormValue.expectedAmount : 0,
      applicationId: this.application.id,
    };
    if (paymentFormValue.paymentDate) {
      payment.paymentDate = paymentFormValue.paymentDate;
    }
    this.paymentService.create(payment).subscribe((paymentResponse) => {
      this.paymentService.uploadFiles(paymentResponse.id, this.paymentFilesToUpload).subscribe(() => {
        paymentForm.resetForm();
        this.paymentTable.loadPayments();
        this.loadApplication(this.application.id);
      });
    });
  }

  openGroup(id: number, $event) {
    $event.stopPropagation();
    this.router.navigate(['groups', id]);
  }

  paymentChange($event) {
    this.paymentFilesToUpload = (<any>event.target).files;
  }

  editFiles(application: Application) {
    const filesDialogRef = this.filesDialog.open(UfileComponent, {
      disableClose: true,
      minWidth: '40%',
      data: {
        targetId: application.contract.id,
        files: application.contract.files,
        type: UfileTypes.CONTRACT
      }
    });
  }
}
