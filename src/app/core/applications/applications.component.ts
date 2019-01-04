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
import {Eapplication} from '../../models/eapplication';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  @ViewChild('formpanel') formPanel: MatExpansionPanel;
  @ViewChild('applicationsTable') applicationsTable;

  selectedClient: Client = new Client();

  byEapplication = false;

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
    let eapplication: Eapplication = null;
    const eapplicationJSON = this.activatedRoute.snapshot.queryParams.eapplication;
    if (eapplicationJSON) {
      this.byEapplication = true;
      try {
        eapplication = JSON.parse(eapplicationJSON);
        this.applicationForm.wantPractice = eapplication.wantPractice;
        this.applicationForm.date = eapplication.date;
        this.formPanel.open();
      } catch (e) {
        this.byEapplication = false;
        eapplication = null;
      }
    }

    this.activatedRoute.queryParams.subscribe((query) => {
      if (query.client) {
        this.selectedClient = JSON.parse(query.client);
        this.applicationForm = this.storageService.applicationsLevel ? this.storageService.applicationsLevel : this.applicationForm;
        this.formPanel.open();
      }
    });
    this.sourceService.getSources({}).subscribe(response => {
      this.sources = response.models;
      if (this.byEapplication && eapplication) {
        const foundedSource = this.sources.find(s => s.name === eapplication.source);
        if (foundedSource) {
          this.applicationForm.sources = [foundedSource.id];
        }
      }
    });
    this.courseService.getCourses({}).subscribe(response => {
      this.courses = response.models;
      if (this.byEapplication && eapplication) {
        const foundedCourse = this.courses.find(c => c.name === eapplication.course);
        if (foundedCourse) {
          this.applicationForm.courseId = foundedCourse.id;
        }
      }
    });
    this.citiesService.getCities({}).subscribe(response => {
      this.cities = response.models;
      if (this.byEapplication && eapplication) {
        const foundedCity = this.cities.find(c => c.name === eapplication.city);
        if (foundedCity) {
          this.applicationForm.cityId = foundedCity.id;
        }
      }
    });
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
    const value = +$event.target.value;
    if (value < 0) {
      this.applicationForm.discount = 0;
      $event.target.value = this.applicationForm.discount;
    }
    if (value > 100) {
      this.applicationForm.discount = 100;
      $event.target.value = this.applicationForm.discount;
    }
  }

}
