import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Lesson} from '../../../models/lesson';
import {LessonService} from '../../../services/lesson.service';
import {ApplicationService} from '../../../services/application.service';
import {Observable} from 'rxjs';
import {Application} from '../../../models/application';
import {MatSelectionList, MatSelectionListChange} from '@angular/material';

@Component({
  selector: 'app-single-lesson',
  templateUrl: './single-lesson.component.html',
  styleUrls: ['./single-lesson.component.css']
})
export class SingleLessonComponent implements OnInit {

  @ViewChild('clientsList') clientsList: MatSelectionList;

  lesson: Lesson = new Lesson();
  applications: Application[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
    return this.lessonService.getLessonById(id,
      {
        attributes: ['id', 'topic', 'main', 'groupId'],
        include: ['application']
      }
    );
  }

  loadApplications() {
    this.applicationService.getApplications({
      q: {groupId: this.lesson.groupId},
      include: ['client'],
      attributes: ['id', 'clientId', 'groupId'],
    }).subscribe(response => {
      this.applications = this.sortArrByName(response.models);
      this.clientsList.selectionChange.subscribe((s) => this.updateJournal(s));
    });
  }

  updateLesson() {
    const lessonToUpdate = {
      topic: this.lesson.topic,
      main: this.lesson.main ? 1 : 0
    };
    this.lessonService.update(this.lesson.id, <any>lessonToUpdate).subscribe(updated => {
      this.loadLesson(updated.id).subscribe(value => {
        this.lesson = {...value, applications: this.lesson.applications};
      });
    });
  }

  private updateJournal(s: MatSelectionListChange) {
    const selectedClients = s.source.selectedOptions.selected.map(option => option.value);
    this.lessonService.update(this.lesson.id, {applications: selectedClients}).subscribe(() => {
      this.loadLesson(this.lesson.id).subscribe(value => this.lesson = value);
    });
  }

  isPresent(id: number) {
    return this.lesson.applications.some(value => value.id == id);
  }

  openClient(clientId: number, $event) {
    $event.stopPropagation();
    this.router.navigate(['clients', clientId]);
  }

  sortArrByName(arr) {
    const result = arr.sort(function(a, b) {
      let nameA = a.client.name.toUpperCase(); // ignore upper and lowercase
      let nameB = b.client.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    return result;
  }

}
