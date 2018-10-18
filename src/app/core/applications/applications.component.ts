import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../../models/client';
import {MatExpansionPanel} from '@angular/material';
import {Source} from '../../models/source';
import {Course} from '../../models/course';
import {SourceService} from '../../services/source.service';
import {CourseService} from '../../services/course.service';
import {MaterialTableService} from '../../services/material-table.service';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {ApplicationService} from '../../services/application.service';
import {Application} from '../../models/application';
import {isNumber} from 'util';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  @ViewChild('formpanel') formPanel: MatExpansionPanel;

  selectedClient: Client = new Client();

  applications: Application[] = [];
  sources: Source[] = [];
  courses: Course[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  applicationForm = {
    sourceId: null,
    courseId: null,
    date: null,
    discount: 0,
  };

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public sourceService: SourceService,
    public courseService: CourseService,
    public materialTableService: MaterialTableService,
    public applicationService: ApplicationService,
    public storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((query) => {
      if (query.client) {
        this.selectedClient = JSON.parse(query.client);
        this.applicationForm = this.storageService.applicationsLevel ? this.storageService.applicationsLevel : this.applicationForm;
        this.formPanel.open();
      }
    });
    this.sourceService.getSources({}).subscribe(response => this.sources = response.models);
    this.courseService.getCourses({}).subscribe(response => this.courses = response.models);
    this.loadApplications();
  }

  selectClient($event) {
    $event.stopPropagation();
    this.storageService.applicationsLevel = this.applicationForm;
    this.router.navigate(['clients'], {
      queryParams: {
        backURL: ['applications'],
        selectEvent: true
      }
    });
  }

  loadApplications() {
    this.sendLoadApplications().subscribe(response => {
      this.count = response.count;
      this.applications = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadApplications();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadApplications();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadApplications();
  }

  private sendLoadApplications(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.applicationService.getApplications({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['client', 'course', 'group', 'source']
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter['client.name']) {
      res.client = {name: `${this.filter['client.name']}`};
    }
    if (this.filter['course.name']) {
      res.course = {name: `${this.filter['course.name']}`};
    }
    if (this.filter['group.name']) {
      res.group = {name: `${this.filter['group.name']}`};
    }
    if (this.filter['source.name']) {
      res.source = {name: `${this.filter['source.name']}`};
    }
    if (this.filter.fullPrice) {
      res.fullPrice = this.filter.fullPrice;
    }
    if (this.filter.discount) {
      res.discount = this.filter.discount;
    }
    if (this.filter.resultPrice) {
      res.resultPrice = this.filter.resultPrice;
    }
    if (this.filter.leftToPay) {
      res.leftToPay = this.filter.leftToPay;
    }

    return res;
  }

  createApplication(applicationForm: NgForm) {
    const application: Application = <Application>{
      clientId: this.selectedClient.id,
      sourceId: this.applicationForm.sourceId ? this.applicationForm.sourceId : null,
      courseId: this.applicationForm.courseId,
      date: this.applicationForm.date,
      discount: +this.applicationForm.discount ? +this.applicationForm.discount : 0,
    };
    this.applicationService.create(application).subscribe((applicationResponse) => {
      applicationForm.resetForm();
      this.selectedClient = new Client();
      this.loadApplications();
    });
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.applicationService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadApplications();
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


  validateDiscount($event) {
    const value = $event.target.value;
    if (value < 0) {
      $event.target.value = 0;
    }
    if (value > 100) {
      $event.target.value = 100;
    }
  }

}
