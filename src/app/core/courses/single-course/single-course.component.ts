import {Component, OnInit, ViewChild} from '@angular/core';
import {Course} from '../../../models/course';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../services/course.service';
import {AuthService} from '../../../services/auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {

  @ViewChild('form') updateCourseForm: NgForm;

  course: Course = new Course();

  canUpdateCourse = false;
  canDeleteGroup = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sourceService: CourseService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {

      this.sourceService.getCourseById(id, {attributes: ['id', 'name', 'fullPrice', 'discount', 'resultPrice']})
        .subscribe(course => {
          this.course = course;

          const p = this.authService.getLocalPrincipal();
          this.canUpdateCourse = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
          this.canDeleteGroup = this.canUpdateCourse;
          if (!this.canUpdateCourse) {
            this.updateCourseForm.form.disable();
          }
        });
    });
  }

  updateCourse() {
    if (this.canUpdateCourse) {
      this.sourceService.update(this.course.id, this.course).subscribe(updated => this.course = updated);
    }
  }


  validateDiscount($event) {
    const value = +$event.target.value;
    if (value < 0) {
      this.course.discount = 0;
      $event.target.value = this.course.discount;
    }
    if (value > 100) {
      this.course.discount = 100;
      $event.target.value = this.course.discount;
    }
  }

}
