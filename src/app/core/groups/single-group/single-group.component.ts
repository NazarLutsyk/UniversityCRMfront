import {Component, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../models/group';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../../services/group.service';
import {LessonService} from '../../../services/lesson.service';
import {NgModel} from '@angular/forms';
import {Application} from '../../../models/application';
import {ApplicationService} from '../../../services/application.service';
import {Observable} from 'rxjs';
import {MatSelectionListChange} from '@angular/material';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.css']
})
export class SingleGroupComponent implements OnInit {

  @ViewChild('lessonsTable') lessonsTable;
  @ViewChild('practiceList') practiceList;

  applicationsToPractice: Application[] = [];
  group: Group = new Group();

  canSelect = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private lessonService: LessonService,
    private applicationService: ApplicationService
  ) {
  }

  ngOnInit() {
    this.practiceList.selectionChange.subscribe((s: MatSelectionListChange) => {
      const applicationId = s.option.value;
      const selected = s.option.selected;
      this.applicationService
        .update(applicationId, {hasPractice: selected ? 1 : 0})
        .subscribe(app => {
          this.loadGroup(this.group.id).subscribe(group => this.group = group);
          const index = this.applicationsToPractice.findIndex(a => a.id === applicationId);
          if (this.applicationsToPractice[index]) {
            this.applicationsToPractice[index].hasPractice = selected;
          }
        });
    });

    this.activatedRoute.params.subscribe(({id}) => {
      this.loadGroup(id).subscribe(group => {
        this.group = group;
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
        this.canSelect = true;
      } else {
        this.canSelect = false;
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
  }
}
