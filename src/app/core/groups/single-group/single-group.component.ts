import {Component, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../models/group';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../../services/group.service';
import {LessonService} from '../../../services/lesson.service';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.css']
})
export class SingleGroupComponent implements OnInit {

  @ViewChild('lessonsTable') lessonsTable;

  group: Group = new Group();

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private lessonService: LessonService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.loadGroup(id);
    });
  }

  loadGroup(id) {
    this.groupService.getGroupById(id, {attributes: ['id', 'name', 'startDate', 'startTime'], include: ['course']})
      .subscribe(group => this.group = group);
  }

  updateGroup() {
    this.groupService.update(this.group.id, this.group).subscribe(updated => {
      this.loadGroup(updated.id);
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
}
