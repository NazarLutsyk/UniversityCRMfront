import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Lesson} from '../../../models/lesson';
import {LessonService} from '../../../services/lesson.service';
import {ApplicationService} from '../../../services/application.service';
import {Observable} from 'rxjs';
import {Application} from '../../../models/application';

@Component({
  selector: 'app-single-lesson',
  templateUrl: './single-lesson.component.html',
  styleUrls: ['./single-lesson.component.css']
})
export class SingleLessonComponent implements OnInit {

  lesson: Lesson = new Lesson();
  applications: Application[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private lessonService: LessonService,
    private applicationService: ApplicationService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({lessonId}) => {
      this.loadLesson(lessonId).subscribe((lesson) => {
        this.lesson = lesson;
        this.loadApplications();
      });
    });
  }

  loadLesson(id): Observable<Lesson> {
    return this.lessonService.getLessonById(id, {attributes: ['id', 'topic', 'main', 'groupId']});
  }

  loadApplications() {
    this.applicationService.getApplications({
      q: {groupId: this.lesson.groupId},
      include: ['client'],
      attributes: ['id', 'clientId', 'groupId']
    }).subscribe(applications => {
      this.applications = applications;
    });
  }

  updateLesson() {
    const lessonToUpdate = {
      ...this.lesson,
      main: this.lesson.main ? 1 : 0
    };
    this.lessonService.update(this.lesson.id, <any>lessonToUpdate).subscribe(updated => {
      this.loadLesson(updated.id);
    });
  }

}
