import {Component, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../models/group';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../../services/group.service';
import {LessonService} from '../../../services/lesson.service';
import {NgForm, NgModel} from '@angular/forms';
import {Application} from '../../../models/application';
import {ApplicationService} from '../../../services/application.service';
import {Observable} from 'rxjs';
import {MatSelectionListChange} from '@angular/material';
import {count, map} from 'rxjs/operators';
import {AuthService} from '../../../services/auth.service';
import {StatisticService} from '../../../services/statistic.service';
import {ChartService} from '../../../services/chart.service';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.css']
})
export class SingleGroupComponent implements OnInit {

  @ViewChild('form') updateGroupForm: NgForm;
  @ViewChild('lessonsTable') lessonsTable;
  @ViewChild('practiceList') practiceList;
  @ViewChild('appApplctnTable') appApplctnTable;

  applicationsToPractice: Application[] = [];
  group: Group = new Group();

  hasFreePracticePlaces = false;
  canSelectPractice = false;
  canUpdateGroup = false;
  canCreateLesson = false;
  canDeleteLesson = false;
  canDeleteApplication = false;

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

  studentsQuantity: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private lessonService: LessonService,
    private applicationService: ApplicationService,
    private router: Router,
    public authService: AuthService,
    private statisticService: StatisticService,
    private chartService: ChartService
  ) {
  }

  ngOnInit() {
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
      this.loadGroup(id).subscribe(group => {
        this.group = group;
        this.loadStatistic();
        const p = this.authService.getLocalPrincipal();
        this.canUpdateGroup = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
        this.canSelectPractice = this.canUpdateGroup;
        this.canCreateLesson = this.canUpdateGroup
          || [this.authService.roles.TEACHER_ROLE].indexOf(this.authService.getLocalPrincipal().role) > -1;
        this.canDeleteLesson = this.canCreateLesson;
        this.canDeleteApplication = this.canUpdateGroup;
        if (!this.canUpdateGroup) {
          this.updateGroupForm.form.disable();
        }

        this.loadPractice();
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
      attributes: ['id', 'name', 'freePractice', 'usedPractice', 'startDate', 'startTime'],
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
      startTime: this.group.startTime,
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
      this.appApplctnTable.$quantityGroupStudents.subscribe((res) => {
        this.studentsQuantity = res;
      });
    });
  }

}


