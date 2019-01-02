import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../services/material-table.service';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {Course} from '../../models/course';
import {CourseService} from '../../services/course.service';
import {isNumber} from 'util';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];
  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  canCreateCourse = false;
  canDeleteCourse = false;

  constructor(
    private coursesService: CourseService,
    private router: Router,
    public materialTableService: MaterialTableService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    const p = this.authService.getLocalPrincipal();
    this.canCreateCourse = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
    this.canDeleteCourse = this.canCreateCourse;
    this.loadCourses();
  }

  loadCourses() {
    this.sendLoadCourses().subscribe(response => {
      this.count = response.count;
      this.courses = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadCourses();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadCourses();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadCourses();
  }

  private sendLoadCourses(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.coursesService.getCourses({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter.name) {
      res.name = {$like: `${this.filter.name}`};
    }
    if (this.filter.fullPrice) {
      res.fullPrice = this.filter.fullPrice;
    }
    if (this.filter.discount) {
      res.discount = this.filter.discount;
    }
    if (this.filter.resultPrice) {
      res.resultPrice = this.filter.resultPrice;
    }

    return res;
  }

  createCourse(courseForm: NgForm) {
    const course: Course = <Course>courseForm.form.value;
    this.coursesService.create(course).subscribe((courseResponse) => {
      courseForm.resetForm();
      this.loadCourses();
    });
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.coursesService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadCourses();
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

  validateDiscount($event) {
    const value = $event.target.value;
    if (value < 0) {
      $event.target.value = 0;
    }
    if (value > 100) {
      $event.target.value = 100;
    }
  }
}
