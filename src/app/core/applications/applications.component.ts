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
import {ContractService} from '../../services/contract.service';
import {ClientService} from '../../services/client.service';
import {GroupService} from '../../services/group.service';
import {Group} from '../../models/group';

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

  contractFilesToUpload: File[] = [];

  sources: Source[] = [];
  courses: Course[] = [];
  cities: City[] = [];

  applicationForm = {
    sources: null,
    courseId: null,
    cityId: null,
    groupId: null,
    date: null,
    discount: '',
    wantPractice: false,
    fullPrice: 0
  };
  groups: Group[];

  constructor(
    public sourceService: SourceService,
    public courseService: CourseService,
    private citiesService: CityService,
    public applicationService: ApplicationService,
    public storageService: StorageService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private contractService: ContractService,
    private clientService: ClientService,
    private groupService: GroupService
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
        this.citiesService.getCities({q: {name: {$like: eapplication.city}}}).subscribe(res => {
          if (res.models[0] != undefined) {
            this.applicationForm.cityId = res.models.id;
            setTimeout(() => {
              this.loadGroups();
            }, 500);
          }
        });
        this.courseService.getCourses({q: {name: {$like: eapplication.course}}}).subscribe(res => {
          if (res.models[0] != undefined) {
            this.applicationForm.courseId = res.models.id;
            setTimeout(() => {
              this.loadGroups();
            }, 500);
          }
        });
        this.sourceService.getSources({q: {name: {$like: eapplication.source}}}).subscribe(res => {
          if (res.models[0] != undefined) {
            this.applicationForm.sources = [res.models[0]];
          }
        });
        this.applicationForm.wantPractice = eapplication.wantPractice;
        this.clientService.getClients(
          {q: {phone: {$like: eapplication.phone}, email: {$like: eapplication.email}}})
          .subscribe((res: any) => {
            if (res.models[0] != undefined) {
              this.selectedClient = res.models[0];
            }
          });
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
      groupId: this.applicationForm.groupId,
      date: this.applicationForm.date,
      discount: this.applicationForm.discount,
      fullPrice: this.applicationForm.fullPrice,
      wantPractice: !!this.applicationForm.wantPractice ? 1 : 0,
      hasPractice: 0
    };
    this.applicationService.create(application).subscribe((applicationResponse) => {
      this.contractService.createContracts(applicationResponse.id, this.contractFilesToUpload).subscribe();
      applicationForm.resetForm();
      this.selectedClient = new Client();
      this.applicationsTable.loadApplications();
    });
  }

  contractChange($event) {
    this.contractFilesToUpload = (<any>event.target).files;
  }

  loadGroups() {
    if (this.applicationForm.courseId && this.applicationForm.cityId) {
      this.groupService.getGroups({
          q: {
            courseId: this.applicationForm.courseId,
            cityId: this.applicationForm.cityId,
            expirationDate: new Date().toJSON().slice(0, 10).replace(/-/g, '-')
          }
        }
      )
        .subscribe(response => {
            this.groups = response.models;
          }
        );
    }
  }

}
