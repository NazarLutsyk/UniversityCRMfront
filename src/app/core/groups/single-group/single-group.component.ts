import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Group} from '../../../models/group';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../../services/group.service';
import {LessonService} from '../../../services/lesson.service';
import {NgForm, NgModel} from '@angular/forms';
import {Application} from '../../../models/application';
import {ApplicationService} from '../../../services/application.service';
import {Observable} from 'rxjs';
import {MatSelectionListChange} from '@angular/material';
import {map} from 'rxjs/operators';
import {AuthService} from '../../../services/auth.service';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';
import {ClientService} from '../../../services/client.service';
import {CityService} from '../../../services/city.service';
import {ClientStatusService} from '../../../services/client-status.service';
// @ts-ignore
import {isNumber} from 'util';
import {ConfigService} from '../../../services/config.service';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.css']
})
export class SingleGroupComponent implements OnInit {

  @ViewChild('form') updateGroupForm: NgForm;
  @ViewChild('applicationsInfo') applicationsInfo: ElementRef;
  @ViewChild('lessonsTable') lessonsTable;
  @ViewChild('practiceList') practiceList;
  @ViewChild('appApplctnTable') appApplctnTable;
  @ViewChild('groupId') groupIdentify: ElementRef;
  @ViewChild('modalClients') modalClients: ElementRef;

  applicationsToPractice: Application[] = [];
  group: Group = new Group();

  hasFreePracticePlaces = false;
  canSelectPractice = false;
  canUpdateGroup = false;
  canCreateLesson = false;
  canDeleteLesson = false;
  canDeleteApplication = false;
  canSeeStatisticOfAppsFromAnotherGroups = false;

  chartLabels: String[] = [];
  chartDatasets: any[] = [];
  chartColors: any[] = [];
  chartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          min: 0,
          stepSize: 1
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          stepSize: 1
        }
      }],
      responsive: true
    }
  };
  appStatisticAll;
  studentsQuantity: number;

  appFromThisAndAnotherGroupPercent: string;
  arrOfAnotherGroups = [];
  currentGroupID;

  arrOfAnotherGroupsAndClients = [];
  allClientStatuses;
  allCities;
  selectEvent = null;
  clientsWithAppsInAnotherGroups = [];
  quantityClientsFromAnotherGroups;
  appByCurrentGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private lessonService: LessonService,
    private applicationService: ApplicationService,
    private router: Router,
    public authService: AuthService,
    private statisticService: StatisticService,
    private chartService: ChartService,
    private renderer: Renderer2,
    private clientService: ClientService,
    private cityService: CityService,
    private clientStatusService: ClientStatusService,
    private configService: ConfigService
  ) {
  }

  ngOnInit() {
    this.getAllStatuses();
    this.getAllCities();
    this.practiceList.selectionChange.subscribe((s: MatSelectionListChange) => {
      if (this.canSelectPractice && this.hasFreePracticePlaces) {
        const applicationId = s.option.value;
        const selected = s.option.selected;
        this.applicationService
          .update(applicationId, {hasPractice: selected ? 1 : 0})
          .subscribe(app => {
            this.loadGroup(this.group.id).subscribe(group => this.group = group);
            const index = this.applicationsToPractice.findIndex(a => a.id === applicationId);
            if (this.applicationsToPractice[index]) {
              this.applicationsToPractice[index].hasPractice = selected ? 1 : 0;
            }
          });
      }
    });

    this.activatedRoute.params.subscribe(({id}) => {
      this.currentGroupID = id;
      this.loadGroup(id).subscribe(group => {
        this.group = group;
        this.loadStatistic();
        const p = this.authService.getLocalPrincipal();
        this.canUpdateGroup = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
        this.canSeeStatisticOfAppsFromAnotherGroups = (
          p && [this.authService.roles.BOSS_ROLE].indexOf(p.role) > -1
        );
        this.canSelectPractice = this.canUpdateGroup;
        this.canCreateLesson = this.canUpdateGroup
          || [this.authService.roles.TEACHER_ROLE].indexOf(this.authService.getLocalPrincipal().role) > -1;
        this.canDeleteLesson = this.canCreateLesson;
        this.canDeleteApplication = this.canUpdateGroup;
        if (!this.canUpdateGroup) {
          this.updateGroupForm.form.disable();
        }
        this.loadPractice();
        setTimeout(() => {
          this.appApplctnTable.sort = 'leftToPay ASC';
          this.appApplctnTable.loadApplications();
        }, 0);
      });
    });
  }

  loadPractice() {
    this.applicationService.getApplications({
      q: {group: {id: this.group.id}, $or: [{wantPractice: 1}, {hasPractice: 1}]},
      sort: 'createdAt DESC',
      attributes: [
        'id',
        'hasPractice',
        'groupId'
      ],
      include: ['client', 'group']
    })
      .subscribe(apps => this.applicationsToPractice = apps.models);
  }

  loadGroup(id): Observable<Group> {
    return this.groupService.getGroupById(id, {
      attributes: ['id', 'name', 'freePractice', 'usedPractice', 'teacher', 'startDate', 'startTime', 'expirationDate'],
      include: ['course', 'city']
    }).pipe(map((group) => {
      if (group.freePractice > 0) {
        this.hasFreePracticePlaces = true;
      } else {
        this.hasFreePracticePlaces = false;
      }
      return group;
    }));
  }

  updateGroup() {
    const groupToUpdate = {
      name: this.group.name,
      freePractice: this.group.freePractice,
      startDate: this.group.startDate,
      expirationDate: this.group.expirationDate,
      startTime: this.group.startTime,
      teacher: this.group.teacher
    };
    this.groupService.update(this.group.id, <Group>groupToUpdate).subscribe(updated => {
      this.loadGroup(updated.id).subscribe(group => this.group = group);
    });
  }

  createLesson(ngForm) {
    const lessonFromForm = ngForm.form.value;
    lessonFromForm.main = lessonFromForm.main ? 1 : 0;
    lessonFromForm.groupId = this.group.id;
    this.lessonService.create(lessonFromForm).subscribe(() => {
      ngForm.resetForm();
      this.lessonsTable.loadLessons();
    });
  }

  validatePractice(inputRef: NgModel) {
    if (!Number.isInteger(this.group.freePractice) || +this.group.freePractice <= 0) {
      this.group.freePractice = 0;
      inputRef.reset(this.group.freePractice);
    } else {
      this.group.freePractice = inputRef.value;
      inputRef.reset(inputRef.value);
    }
  }

  openApplication(id: number, $event) {
    $event.stopPropagation();
    this.router.navigate(['applications', id]);
  }

  loadStatistic() {
    this.statisticService.getJournalStatisticByGroup(
      {
        q:
          {
            groupId: this.group.id
          }
      }
    ).subscribe((res) => {
      this.chartLabels = res.map(s => s.client);
      const data = res.map(s => s.count);
      this.chartDatasets = [
        {
          label: 'Journal',
          data,
        }
      ];
      this.chartColors = [{
        backgroundColor: this.chartService.getRandomColors(data.length)
      }];
      this.appApplctnTable.$quantityGroupStudents.subscribe((resp) => {
        this.studentsQuantity = resp;
      });
    });
  }

  showGroupAppStat() {
    if (this.canSeeStatisticOfAppsFromAnotherGroups) {
      this.statisticService.getStatisticByGroupByApplications(this.currentGroupID).subscribe(res => {
        this.appStatisticAll = res;
        for (let i = 0; i < this.appStatisticAll.result.length; i++) {
          this.groupService.getGroupById(this.appStatisticAll.result[i].groupId, {}).subscribe((group: any) => {
            if (group) {
              let curGrupId = group.id;
              if (this.arrOfAnotherGroups[curGrupId]) {
              } else {
                this.arrOfAnotherGroups[curGrupId] = group;
              }
              if (this.arrOfAnotherGroups[curGrupId]) {
                if (this.arrOfAnotherGroups[curGrupId].applications) {
                  this.arrOfAnotherGroups[curGrupId].applications.push(this.appStatisticAll.result[i]);
                } else {
                  this.arrOfAnotherGroups[curGrupId].applications = [];
                  this.arrOfAnotherGroups[curGrupId].applications.push(this.appStatisticAll.result[i]);
                }
              }
                this.appByCurrentGroup = res.applicationsByGroup.length;
                this.getClientsQuantity(this.appByCurrentGroup);
            }
          });
        }
        const blockAppStatic = document.getElementsByClassName('app-statistic');
        blockAppStatic[0].addEventListener('mouseover', (event: any) => {
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'left', `${event.target.offsetLeft}px`);
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'top', `${event.target.offsetTop - 200}px`);
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'position', 'absolute');
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'display', 'block');
        });
        this.applicationsInfo.nativeElement.addEventListener('mouseover', (event: any) => {
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'position', 'absolute');
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'display', 'block');
        });
        blockAppStatic[0].addEventListener('mouseleave', (event: any) => {
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'display', 'none');
        });
        this.applicationsInfo.nativeElement.addEventListener('mouseleave', (event: any) => {
          this.renderer.setStyle(this.applicationsInfo.nativeElement, 'display', 'none');
        });
      });
    }
  }

  showClientsFromAnotherGroups () {
    if (this.canSeeStatisticOfAppsFromAnotherGroups) {
      this.getClientsFromAnotherGroup(this.appByCurrentGroup);
      this.renderer.setStyle(this.modalClients.nativeElement, 'display', 'flex');
      document.addEventListener('click', (e: any) => {
        if (e.target.classList.contains('modal-clients-background')) {
          this.closeModalClients();
        } else if (e.target.classList.contains('close-modal-clients')) {
          this.closeModalClients();
        }
      });
    }
  }

  getClientsFromAnotherGroup(appByCurrentGroup) {
    if (this.canSeeStatisticOfAppsFromAnotherGroups) {
      for (let group of this.arrOfAnotherGroups) {
        if (group) {
          let cGId = group.id;
          let i = 1;
          for (let app of group.applications) {
            this.clientService.getClientById(app.clientId, {}).subscribe((client: any) => {
              group.city = this.getGroupCity(group.cityId);
              this.arrOfAnotherGroupsAndClients[cGId] = group;
              if (this.arrOfAnotherGroupsAndClients[cGId].clients) {
                client.status = this.getClientStatus(client.statusId);
                this.arrOfAnotherGroupsAndClients[cGId].clients.push(client);
              } else {
                this.arrOfAnotherGroupsAndClients[cGId].clients = [];
                client.status = this.getClientStatus(client.statusId);
                this.arrOfAnotherGroupsAndClients[cGId].clients.push(client);
              }
            });
          }
        }
      }
    }
  }

getClientsQuantity (appByCurrentGroup) {
  if (this.canSeeStatisticOfAppsFromAnotherGroups) {
    for (let group of this.arrOfAnotherGroups) {
      if (group) {
        let cGId = group.id;
        let i = 1;
        for (let app of group.applications) {
          this.clientService.getClientById(app.clientId, {}).subscribe((client: any) => {
            this.clientsWithAppsInAnotherGroups[client.id] = client;
            if (i === group.applications.length && app.groupId === this.arrOfAnotherGroups[this.arrOfAnotherGroups.length - 1].id) {
              const clients = [];
              for (let cl of this.clientsWithAppsInAnotherGroups) {
                if (cl) {
                  clients.push(cl);
                }
              }
              this.quantityClientsFromAnotherGroups = clients.length;
              this.appFromThisAndAnotherGroupPercent = this.widthOfVisitedBlock(
                this.appByCurrentGroup,
                this.quantityClientsFromAnotherGroups
              );
            }
            i++;
          });
        }
      }
    }
  }
}

  getClientStatus(statusId) {
    for (let i = 0; i < this.allClientStatuses.length; i++) {
      if (this.allClientStatuses[i].id === statusId) {
        return this.allClientStatuses[i];
      }
    }
  }

  getGroupCity(cityId) {
    for (let i = 0; i < this.allCities.length; i++) {
      if (this.allCities[i].id === cityId) {
        return this.allCities[i];
      }
    }
  }

  closeModalClients() {
    for (let group of this.arrOfAnotherGroups) {
      if (group) {
        group.clients = [];
      }
    }
    this.renderer.setStyle(this.modalClients.nativeElement, 'display', 'none');
  }

  getAllStatuses() {
    this.clientStatusService.getStatuses({}).subscribe((statuses) => {
      this.allClientStatuses = statuses.models;
    });
  }
  getAllCities() {
    this.cityService.getCities({}).subscribe((cities) => {
      this.allCities = cities.models;
    });
  }

  widthOfVisitedBlock(a, b) {
    const x = (b * 100) / a;
    const result = (59.8 * x) / 100;
    return `${result}vw`;
  }

  open(client, url, $event) {
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

  getPhoneNumbers() {
    this.groupService.getNumbersByGroupId(this.currentGroupID).subscribe((res: {path: string}) => {
      this.downloadFile(res.path);
    });
  }

  getEmails() {
    this.groupService.getEmailsByGroupId(this.currentGroupID).subscribe((res: {path: string}) => {
      this.downloadFile(res.path);
    });
  }

private downloadFile(path) {
  window.open(`${this.configService.public}/${path}`);
}

}


