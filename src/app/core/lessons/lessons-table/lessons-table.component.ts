import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {Observable} from 'rxjs';
import {Lesson} from '../../../models/lesson';
import {LessonService} from '../../../services/lesson.service';
import {isNumber} from 'util';

@Component({
  selector: 'app-lessons-table',
  templateUrl: './lessons-table.component.html',
  styleUrls: ['./lessons-table.component.css']
})
export class LessonsTableComponent implements OnInit {

  @Input() byGroupId;


  lessons: Lesson[] = [];
  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    private lessonService: LessonService,
    private router: Router,
    public materialTableService: MaterialTableService
  ) {
  }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.sendLoadLessons().subscribe(response => {
      this.count = response.count;
      this.lessons = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadLessons();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadLessons();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadLessons();
  }

  private sendLoadLessons(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.lessonService.getLessons({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize
    });
  }

  private getFilterToSend() {
    const res: any = {};

    console.log(this.filter);
    if (this.filter.topic) {
      res.name = {$like: `${this.filter.topic}`};
    }
    if (this.filter.main === false || this.filter.main === true) {
      res.main = this.filter.main ? 1 : 0;
    }

    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.lessonService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadLessons();
      });
    });
  }

  open(id, url, $event) {
    $event.stopPropagation();
    const isControl = $event.target.dataset.controls;
    if (isControl || !isNumber(id)) {
      return false;
    }
    this.router.navigate([...url.split('/'), id]);
  }

}
