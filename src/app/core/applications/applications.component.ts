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
import {City} from '../../models/city';
import {CityService} from '../../services/city.service';

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
  cities: City[] = [];

  applicationForm = {
    sources: null,
    courseId: null,
    cityId: null,
    date: null,
    discount: 0,
    wantPractice: false
  };

  constructor(
    public sourceService: SourceService,
    public courseService: CourseService,
    private citiesService: CityService,
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
    this.citiesService.getCities({}).subscribe(response => this.cities = response.models);
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
      sources: this.applicationForm.sources ? this.applicationForm.sources : null,
      courseId: this.applicationForm.courseId,
      cityId: this.applicationForm.cityId,
      date: this.applicationForm.date,
      discount: +this.applicationForm.discount ? +this.applicationForm.discount : 0,
      wantPractice: !!this.applicationForm.wantPractice,
      hasPractice: false
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
      this.applicationForm.discount = 0;
    }
    if (value > 100) {
      this.applicationForm.discount = 100;
    }
  }

}
