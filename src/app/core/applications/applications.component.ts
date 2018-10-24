import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../../models/client';
import {MatExpansionPanel} from '@angular/material';
import {Source} from '../../models/source';
import {Course} from '../../models/course';
import {SourceService} from '../../services/source.service';
import {CourseService} from '../../services/course.service';
import {NgForm} from '@angular/forms';
import {ApplicationService} from '../../services/application.service';
import {Application} from '../../models/application';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  @ViewChild('formpanel') formPanel: MatExpansionPanel;
  @ViewChild('applicationsTable') applicationsTable;

  selectedClient: Client = new Client();

  sources: Source[] = [];
  courses: Course[] = [];

  applicationForm = {
    sourceId: null,
    courseId: null,
    date: null,
    discount: 0,
  };

  constructor(
    public sourceService: SourceService,
    public courseService: CourseService,
    public applicationService: ApplicationService,
    public storageService: StorageService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
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
      this.applicationsTable.loadApplications();
    });
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
