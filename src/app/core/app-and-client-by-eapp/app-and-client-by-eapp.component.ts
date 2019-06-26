import {Component, OnInit, ViewChild} from '@angular/core';
import {ClientStatus} from '../../models/client-status';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, NgForm} from '@angular/forms';
import {Client} from '../../models/client';
import {ClientService} from '../../services/client.service';
import {MatDialog, MatExpansionPanel} from '@angular/material';
import {ClientStatusService} from '../../services/client-status.service';
import {GroupService} from '../../services/group.service';
import {CityService} from '../../services/city.service';
import {CourseService} from '../../services/course.service';
import {SourceService} from '../../services/source.service';
import {City} from '../../models/city';
import {Source} from '../../models/source';
import {Course} from '../../models/course';
import {StorageService} from '../../services/storage.service';
import {ApplicationService} from '../../services/application.service';
import {Group} from '../../models/group';
import {AuthService} from '../../services/auth.service';
// @ts-ignore
import {isNumber} from 'util';
import {EapplicationService} from '../../services/eapplication.service';

@Component({
  selector: 'app-app-and-client-by-eapp',
  templateUrl: './app-and-client-by-eapp.component.html',
  styleUrls: ['./app-and-client-by-eapp.component.css']
})
export class AppAndClientByEappComponent implements OnInit {

  @ViewChild('form') eAppForm: NgForm;
  @ViewChild('clientsPanel') clientsPanel: MatExpansionPanel;
  disableSelect = new FormControl(true);
  clientStatuses: ClientStatus[] = [];
  clientsByEapp: Client[] = [];
  eappFormObject = {
    id: null,
    clientId: null,
    name: null,
    surname: null,
    age: null,
    phone: null,
    email: null,
    address: null,
    statusId: null,
    cityId: null,
    courseId: null,
    type: null,
    socialId: null,
    sourceId: null,
    groupId: null,
    wantTime: null,
    comment: null,
    date: null,
    updateAt: null,
    createdAt: null,
    wantPractice: null,
    fullPrice: null,
    discount: null
  };
  byEapplication = false;
  selectedClient: Client = new Client();

  selectEvent = null;

  cities: City[];
  sources: Source[] = [];
  courses: Course[] = [];
  clientAngAppFromEapp;

  groups: Group[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientService,
    private createClientDialog: MatDialog,
    private clientStatusesService: ClientStatusService,
    private groupService: GroupService,
    private citiesService: CityService,
    private courseService: CourseService,
    private sourceService: SourceService,
    private storageService: StorageService,
    private applicationsService: ApplicationService,
    private eAppService: EapplicationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((query) => {
      if (query.selectEvent) {
        this.selectEvent = {
          backURL: query.backURL
        };
      }
    });
    this.clientStatusesService.getStatuses({}).subscribe(res => this.clientStatuses = res.models);
    this.courseService.getCourses({}).subscribe(response => {
      this.courses = response.models;
    });
    this.citiesService.getCities({}).subscribe(response => {
      this.cities = response.models;
    });
    this.sourceService.getSources({}).subscribe(response => {
      this.sources = response.models;
    });
    setTimeout(() => {
      const clientJSON = this.activatedRoute.snapshot.queryParams.client;
      if (clientJSON) {
        try {
          this.clientAngAppFromEapp = JSON.parse(clientJSON);
          this.eappFormObject.id = this.clientAngAppFromEapp.id;
          this.eappFormObject.name = this.clientAngAppFromEapp.name;
          this.eappFormObject.surname = this.clientAngAppFromEapp.surname;
          this.eappFormObject.age = this.clientAngAppFromEapp.age;
          this.eappFormObject.phone = this.clientAngAppFromEapp.phone;
          this.eappFormObject.email = this.clientAngAppFromEapp.email;
          this.eappFormObject.address = this.clientAngAppFromEapp.address;
          this.eappFormObject.statusId = this.clientAngAppFromEapp.statusId;
          this.eappFormObject.type = this.clientAngAppFromEapp.type;
          this.eappFormObject.wantTime = this.clientAngAppFromEapp.wantTime;
          this.eappFormObject.comment = this.clientAngAppFromEapp.comment;
          this.eappFormObject.date = this.clientAngAppFromEapp.date;
          this.eappFormObject.updateAt = this.clientAngAppFromEapp.updateAt;
          this.eappFormObject.createdAt = this.clientAngAppFromEapp.createdAt;
          this.eappFormObject.wantPractice = this.clientAngAppFromEapp.wantPractice;
            if (this.clientAngAppFromEapp.source) {
              this.sourceService.getSources({q: {name: this.clientAngAppFromEapp.source}}).subscribe(res => {
                if (res.models[0] != undefined) {
                  this.eappFormObject.sourceId = [res.models[0]];
                }
              });
            }
            if (this.clientAngAppFromEapp.course) {
              this.courseService.getCourses({q: {name: this.clientAngAppFromEapp.course}}).subscribe(res => {
                if (res.models[0] != undefined) {
                  this.eappFormObject.courseId = res.models[0].id;
                  setTimeout(() => {
                    this.loadGroups();
                  }, 500);
                }
              });
            }

            if (this.clientAngAppFromEapp.city) {
              this.citiesService.getCities({q: {name: this.clientAngAppFromEapp.city}}).subscribe(res => {
                if (res.models[0] != undefined) {
                  this.eappFormObject.cityId = res.models[0].id;
                  setTimeout(() => {
                    this.loadGroups();
                  }, 500);
                }
              });
            }
        } catch (e) {
          this.eappFormObject.name = null;
          this.eappFormObject.surname = null;
          this.eappFormObject.email = null;
          this.eappFormObject.phone = null;
        }
        this.byEapplication = true;
      }
      if (this.clientAngAppFromEapp) {
        const client = {
          name: this.clientAngAppFromEapp.name,
          surname: this.clientAngAppFromEapp.surname,
          age: this.clientAngAppFromEapp.age,
          phone: this.clientAngAppFromEapp.phone,
          email: this.clientAngAppFromEapp.email,
          clientId: 1
        };
      this.clientsService.existsForEapp(client).subscribe((alreadyExistsClients) => {
        if (alreadyExistsClients.length) {
          this.selectedClient = alreadyExistsClients[0];
          this.eappFormObject.clientId = this.selectedClient.id;
          this.clientsByEapp = alreadyExistsClients;
          this.clientsPanel.open();
        }
      });
      }
    }, 0);
  }

  removeClient() {
    this.eappFormObject.clientId = null;
  }

  addClientToEappForm(slctdClient) {
    this.eappFormObject.clientId = slctdClient.id;
    this.selectedClient = slctdClient;
  }

  createAppByEapp () {
    this.applicationsService.createByEapp(this.eappFormObject).subscribe( res => {
      if (res.status === 201) {
      this.eAppService.updateStatus(this.eappFormObject.id, {active: 0}).subscribe(() => {
        this.router.navigate(['applications']);
      });
      }
    });
  }

  openClientPage(client, url, $event) {
    $event.stopPropagation();
    if (this.selectEvent) {
      this.router.navigate(this.selectEvent.backURL, {queryParams: {client: JSON.stringify(client)}});
      this.selectEvent = null;
    } else {
      const isControl = $event.target.dataset.controls;
      if (isControl || !isNumber(client.id)) {
        return false;
      }
      this.router.navigate([...url.split('/'), client.id]);
    }
  }

  setAddress(address: any) {
    this.eappFormObject.address = address;
  }

  loadGroups() {
    if (this.eappFormObject.courseId && this.eappFormObject.cityId) {
      this.groupService.getGroups({
          q: {
            courseId: this.eappFormObject.courseId,
            cityId: this.eappFormObject.cityId,
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
